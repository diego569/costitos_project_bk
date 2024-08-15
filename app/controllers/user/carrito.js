const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const createQuotation = async (req, res) => {
  const { userId, name, type, status, quotationCount } = req.body;
  try {
    // Obtener el número más alto de cotización actual
    const maxQuotationNumberResult = await sequelize.query(
      `SELECT COALESCE(MAX("quotationNumber"), 0) AS maxQuotationNumber FROM "Quotations"`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const maxQuotationNumber = maxQuotationNumberResult[0].maxquotationnumber;
    const newQuotationNumber = maxQuotationNumber + 1;
    // Insertar la nueva cotización
    const newQuotationId = uuidv4();
    const [insertedQuotation] = await sequelize.query(
      `
        INSERT INTO "Quotations" (id, "userId", name, type, price, status, "quotationCount", "quotationNumber", "createdAt", "updatedAt")
        VALUES (:id, :userId, :name, :type, 0, :status, :quotationCount, :quotationNumber, NOW(), NOW())
        RETURNING id, "quotationNumber";
        `,
      {
        type: sequelize.QueryTypes.INSERT,
        replacements: {
          id: newQuotationId,
          userId,
          name,
          type,
          status,
          quotationCount,
          quotationNumber: newQuotationNumber,
        },
      }
    );

    res.status(201).json({
      quotationId: insertedQuotation[0].id,
      quotationNumber: insertedQuotation[0].quotationNumber,
    });
  } catch (error) {
    console.error("Error al crear la cotización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const addProductsToQuotation = async (req, res) => {
  const { quotationId, products } = req.body;
  try {
    const productEntries = [];
    const createdQuotationProducts = [];

    for (const product of products) {
      const [result] = await sequelize.query(
        `
          SELECT "productId", "unitOfMeasure" FROM "SupplierProducts" WHERE id = :supplierProductId
          `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { supplierProductId: product.productId },
        }
      );

      if (result && result.productId) {
        const quotationProductId = uuidv4();
        productEntries.push({
          id: quotationProductId,
          quotationId,
          productId: result.productId,
          quantity: product.quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        createdQuotationProducts.push({
          id: quotationProductId,
          productId: result.productId,
          unitOfMeasure: result.unitOfMeasure,
        });
      } else {
        return res.status(400).json({
          error: `No se encontró el producto para el supplierProductId: ${product.productId}`,
        });
      }
    }

    await sequelize.transaction(async (transaction) => {
      for (const entry of productEntries) {
        await sequelize.query(
          `
            INSERT INTO "QuotationProducts" (id, "quotationId", "productId", quantity, "createdAt", "updatedAt")
            VALUES (:id, :quotationId, :productId, :quantity, :createdAt, :updatedAt)
            `,
          {
            type: sequelize.QueryTypes.INSERT,
            replacements: entry,
            transaction,
          }
        );
      }
    });

    res.status(201).json({
      message: "Productos agregados a la cotización con éxito",
      quotationProducts: createdQuotationProducts,
    });
  } catch (error) {
    console.error("Error al agregar productos a la cotización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const addQuotationSupplierProducts = async (req, res) => {
  const { quotationProducts, quotationCount } = req.body; // quotationProducts es un array de { id, productId, unitOfMeasure }

  try {
    // Crear un mapa para contar la cantidad de productos por proveedor
    const supplierProductCounts = new Map();

    // Buscar todos los productos del proveedor y contar las ocurrencias
    for (const qp of quotationProducts) {
      const supplierProducts = await sequelize.query(
        `
          SELECT id AS supplier_product_id, "supplierId", price AS unit_price
          FROM "SupplierProducts"
          WHERE "productId" = :productId AND "unitOfMeasure" = :unitOfMeasure
          `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: {
            productId: qp.productId,
            unitOfMeasure: qp.unitOfMeasure,
          },
        }
      );

      for (const sp of supplierProducts) {
        if (!supplierProductCounts.has(sp.supplierId)) {
          supplierProductCounts.set(sp.supplierId, 0);
        }
        supplierProductCounts.set(
          sp.supplierId,
          supplierProductCounts.get(sp.supplierId) + 1
        );
      }
    }

    // Ordenar los proveedores por la cantidad de productos (de mayor a menor)
    const sortedSuppliers = [...supplierProductCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, quotationCount); // Tomar solo los primeros quotationCount proveedores

    const quotationSupplierProductsEntries = [];

    // Iterar sobre los proveedores ordenados y crear las entradas para QuotationSupplierProducts
    for (const [supplierId] of sortedSuppliers) {
      for (const qp of quotationProducts) {
        const supplierProducts = await sequelize.query(
          `
            SELECT id AS supplier_product_id, "supplierId", price AS unit_price
            FROM "SupplierProducts"
            WHERE "productId" = :productId AND "unitOfMeasure" = :unitOfMeasure AND "supplierId" = :supplierId
            `,
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
              productId: qp.productId,
              unitOfMeasure: qp.unitOfMeasure,
              supplierId,
            },
          }
        );

        for (const sp of supplierProducts) {
          quotationSupplierProductsEntries.push({
            id: uuidv4(),
            quotationProductId: qp.id,
            supplierId: sp.supplierId,
            unitPrice: sp.unit_price,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    // Insertar las entradas en la tabla QuotationSupplierProducts
    await sequelize.transaction(async (transaction) => {
      for (const entry of quotationSupplierProductsEntries) {
        await sequelize.query(
          `
            INSERT INTO "QuotationSupplierProducts" (id, "quotationProductId", "supplierId", "unitPrice", "createdAt", "updatedAt")
            VALUES (:id, :quotationProductId, :supplierId, :unitPrice, NOW(), NOW())
            `,
          {
            type: sequelize.QueryTypes.INSERT,
            replacements: entry,
            transaction,
          }
        );
      }
    });

    res
      .status(201)
      .json({ message: "Productos agregados a la cotización con éxito" });
  } catch (error) {
    console.error("Error al agregar productos a la cotización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createQuotation,
  addProductsToQuotation,
  addQuotationSupplierProducts,
};
