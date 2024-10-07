const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const User = require("../../models/user");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const createQuotation = async (req, res) => {
  const { userId, name, type, status } = req.body;

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["quotationCount"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const quotationCount = user.quotationCount;

    if (quotationCount === 0) {
      return res
        .status(400)
        .json({ error: "No tiene suficientes cotizaciones disponibles." });
    }

    // Corrección: nombre de la propiedad correcta para acceder a maxQuotationNumber
    const maxQuotationNumberResult = await sequelize.query(
      `SELECT COALESCE(MAX("quotationNumber"), 0) AS "maxQuotationNumber" FROM "Quotations"`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const maxQuotationNumber = maxQuotationNumberResult[0].maxQuotationNumber;
    const newQuotationNumber = maxQuotationNumber + 1;

    const newQuotationId = uuidv4();
    const [insertedQuotation] = await sequelize.query(
      `
        INSERT INTO "Quotations" (id, "userId", name, type, price, status, "quotationNumber", "createdAt", "updatedAt")
        VALUES (:id, :userId, :name, :type, 0, :status, :quotationNumber, NOW(), NOW())
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
          quotationNumber: newQuotationNumber,
        },
      }
    );

    await User.update(
      { quotationCount: quotationCount - 1 },
      { where: { id: userId } }
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
          SELECT sp."productId", uom.name AS "unitOfMeasure"
          FROM "SupplierProducts" sp
          JOIN "UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
          WHERE sp.id = :supplierProductId
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
          unitOfMeasure: result.unitOfMeasure, // Ahora obtenemos el nombre de la unidad de medida
        });
      } else {
        return res.status(400).json({
          error: `No se encontró el producto para el supplierProductId: ${product.productId}`,
        });
      }
    }

    // Realizar la inserción dentro de una transacción
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

    // Enviar la respuesta al frontend con los productos creados
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
  const { quotationProducts, quotationCount } = req.body;

  try {
    const supplierProductCounts = new Map();

    for (const qp of quotationProducts) {
      const supplierProducts = await sequelize.query(
        `
          SELECT sp.id AS supplier_product_id, sp."supplierId", sp.price AS unit_price
          FROM "SupplierProducts" sp
          JOIN "UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
          WHERE sp."productId" = :productId AND uom.name = :unitOfMeasure
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

    const sortedSuppliers = [...supplierProductCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, quotationCount);

    const quotationSupplierProductsEntries = [];

    for (const [supplierId] of sortedSuppliers) {
      for (const qp of quotationProducts) {
        const supplierProducts = await sequelize.query(
          `
            SELECT sp.id AS supplier_product_id, sp."supplierId", sp.price AS unit_price
            FROM "SupplierProducts" sp
            JOIN "UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
            WHERE sp."productId" = :productId AND uom.name = :unitOfMeasure AND sp."supplierId" = :supplierId
            `,
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
              productId: qp.productId,
              unitOfMeasure: qp.unitOfMeasure, // Usamos el nombre de la unidad de medida
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
