const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const User = require("../../models/user");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const SupplierProduct = require("../../models/supplierProduct");
const Supplier = require("../../models/supplier");
const Area = require("../../models/area");
const Structure = require("../../models/structure");

// const createQuotation = async (req, res) => {
//   let { userId, name, type, status, quotationCount, areaId } = req.body; // Incluir "areaId"

//   try {
//     const user = await User.findOne({
//       where: { id: userId },
//       attributes: ["quotationCount"],
//     });

//     if (!user) {
//       return res.status(404).json({ error: "Usuario no encontrado." });
//     }

//     const userQuotationCount = user.quotationCount;

//     if (userQuotationCount === 0) {
//       return res
//         .status(400)
//         .json({ error: "No tiene suficientes cotizaciones disponibles." });
//     }

//     // Buscar el área por defecto si areaId es null
//     if (!areaId) {
//       const defaultArea = await Area.findOne({
//         where: { type: "Sin asignar" },
//         attributes: ["id"],
//       });

//       if (!defaultArea) {
//         return res.status(400).json({
//           error: 'No se encontró un área con el tipo "Sin asignar".',
//         });
//       }

//       areaId = defaultArea.id; // Reemplazar areaId con el id del área encontrada
//     }

//     const totalQuotationsResult = await sequelize.query(
//       `SELECT COUNT(*)::INTEGER AS "totalQuotations" FROM "Quotations"`,
//       { type: sequelize.QueryTypes.SELECT }
//     );

//     const newQuotationNumber = totalQuotationsResult[0].totalQuotations + 1;

//     const newQuotationId = uuidv4();
//     const [insertedQuotation] = await sequelize.query(
//       `
//         INSERT INTO "Quotations" (id, "userId", name, type, price, status, "quotationNumber", "quotationCount", "areaId", "createdAt", "updatedAt")
//         VALUES (:id, :userId, :name, :type, 0, :status, :quotationNumber, :quotationCount, :areaId, NOW(), NOW())
//         RETURNING id, "quotationNumber";
//       `,
//       {
//         type: sequelize.QueryTypes.INSERT,
//         replacements: {
//           id: newQuotationId,
//           userId,
//           name,
//           type,
//           status,
//           quotationNumber: newQuotationNumber,
//           quotationCount,
//           areaId, // Usar el área encontrada o proporcionada
//         },
//       }
//     );

//     // Actualizar la cuenta de cotizaciones del usuario
//     await User.update(
//       { quotationCount: userQuotationCount - 1 },
//       { where: { id: userId } }
//     );

//     res.status(201).json({
//       quotationId: insertedQuotation[0].id,
//       quotationNumber: insertedQuotation[0].quotationNumber,
//     });
//   } catch (error) {
//     console.error("Error al crear la cotización:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

const createQuotation = async (req, res) => {
  const { userId, name, type, status, quotationCount } = req.body; // Eliminar areaId del request

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["quotationCount"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userQuotationCount = user.quotationCount;

    if (userQuotationCount === 0) {
      return res
        .status(400)
        .json({ error: "No tiene suficientes cotizaciones disponibles." });
    }

    // Buscar el proyecto "Sin asignar" asociado al usuario
    const defaultProject = await Structure.findOne({
      where: { userId, name: "Sin asignar" },
      attributes: ["id"],
    });

    if (!defaultProject) {
      return res.status(400).json({
        error: 'No se encontró un proyecto "Sin asignar" para este usuario.',
      });
    }

    // Buscar el área "Sin asignar" asociada al proyecto encontrado
    const defaultArea = await Area.findOne({
      where: { structureId: defaultProject.id, type: "Sin asignar" },
      attributes: ["id"],
    });

    if (!defaultArea) {
      return res.status(400).json({
        error: 'No se encontró un área con el tipo "Sin asignar".',
      });
    }

    const areaId = defaultArea.id; // Asignar el areaId encontrado

    // Calcular el número de cotización
    const totalQuotationsResult = await sequelize.query(
      `SELECT COUNT(*)::INTEGER AS "totalQuotations" FROM "Quotations"`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const newQuotationNumber = totalQuotationsResult[0].totalQuotations + 1;

    // Crear la nueva cotización
    const newQuotationId = uuidv4();
    const [insertedQuotation] = await sequelize.query(
      `
        INSERT INTO "Quotations" 
        (id, "userId", name, type, price, status, "quotationNumber", "quotationCount", "areaId", "createdAt", "updatedAt")
        VALUES 
        (:id, :userId, :name, :type, 0, :status, :quotationNumber, :quotationCount, :areaId, NOW(), NOW())
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
          quotationCount,
          areaId, // Área encontrada en la base de datos
        },
      }
    );

    // Actualizar la cuenta de cotizaciones del usuario
    await User.update(
      { quotationCount: userQuotationCount - 1 },
      { where: { id: userId } }
    );

    // Respuesta de éxito
    res.status(201).json({
      quotationId: insertedQuotation[0].id,
      quotationNumber: insertedQuotation[0].quotationNumber,
      message: "Cotización creada exitosamente.",
    });
  } catch (error) {
    console.error("Error al crear la cotización:", error);
    res.status(500).json({ error: "Error interno del servidor." });
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

// const addQuotationSupplierProducts = async (req, res) => {
//   const { quotationProducts, quotationCount } = req.body;

//   try {
//     const supplierProductCounts = new Map();

//     for (const qp of quotationProducts) {
//       const supplierProducts = await sequelize.query(
//         `
//           SELECT sp.id AS supplier_product_id, sp."supplierId", sp.price AS unit_price
//           FROM "SupplierProducts" sp
//           JOIN "UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
//           WHERE sp."productId" = :productId AND uom.name = :unitOfMeasure
//           `,
//         {
//           type: sequelize.QueryTypes.SELECT,
//           replacements: {
//             productId: qp.productId,
//             unitOfMeasure: qp.unitOfMeasure,
//           },
//         }
//       );

//       for (const sp of supplierProducts) {
//         if (!supplierProductCounts.has(sp.supplierId)) {
//           supplierProductCounts.set(sp.supplierId, 0);
//         }
//         supplierProductCounts.set(
//           sp.supplierId,
//           supplierProductCounts.get(sp.supplierId) + 1
//         );
//       }
//     }

//     const sortedSuppliers = [...supplierProductCounts.entries()]
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, quotationCount);

//     const quotationSupplierProductsEntries = [];

//     for (const [supplierId] of sortedSuppliers) {
//       for (const qp of quotationProducts) {
//         const supplierProducts = await sequelize.query(
//           `
//             SELECT sp.id AS supplier_product_id, sp."supplierId", sp.price AS unit_price
//             FROM "SupplierProducts" sp
//             JOIN "UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
//             WHERE sp."productId" = :productId AND uom.name = :unitOfMeasure AND sp."supplierId" = :supplierId
//             `,
//           {
//             type: sequelize.QueryTypes.SELECT,
//             replacements: {
//               productId: qp.productId,
//               unitOfMeasure: qp.unitOfMeasure, // Usamos el nombre de la unidad de medida
//               supplierId,
//             },
//           }
//         );

//         for (const sp of supplierProducts) {
//           quotationSupplierProductsEntries.push({
//             id: uuidv4(),
//             quotationProductId: qp.id,
//             supplierId: sp.supplierId,
//             unitPrice: sp.unit_price,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           });
//         }
//       }
//     }

//     await sequelize.transaction(async (transaction) => {
//       for (const entry of quotationSupplierProductsEntries) {
//         await sequelize.query(
//           `
//             INSERT INTO "QuotationSupplierProducts" (id, "quotationProductId", "supplierId", "unitPrice", "createdAt", "updatedAt")
//             VALUES (:id, :quotationProductId, :supplierId, :unitPrice, NOW(), NOW())
//             `,
//           {
//             type: sequelize.QueryTypes.INSERT,
//             replacements: entry,
//             transaction,
//           }
//         );
//       }
//     });

//     res
//       .status(201)
//       .json({ message: "Productos agregados a la cotización con éxito" });
//   } catch (error) {
//     console.error("Error al agregar productos a la cotización:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

const addQuotationSupplierProducts = async (req, res) => {
  try {
    const { quotationProducts, selectedSupplierIds, quotationCount } = req.body;

    // Validaciones básicas
    if (!Array.isArray(quotationProducts) || quotationProducts.length === 0) {
      return res
        .status(400)
        .json({ error: "Faltan los productos de la cotización." });
    }
    if (
      !Array.isArray(selectedSupplierIds) ||
      selectedSupplierIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Faltan los proveedores seleccionados." });
    }
    if (!quotationCount || typeof quotationCount !== "number") {
      return res
        .status(400)
        .json({ error: "La cantidad de cotizaciones es inválida." });
    }

    const quotationSupplierProductsEntries = [];

    for (const supplierId of selectedSupplierIds) {
      for (const product of quotationProducts) {
        const supplierProducts = await sequelize.query(
          `
          SELECT sp.id AS supplier_product_id, sp."supplierId", sp.price AS unit_price
          FROM "SupplierProducts" sp
          JOIN "UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
          WHERE sp."productId" = :productId AND sp."supplierId" = :supplierId
          `,
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
              productId: product.productId,
              supplierId,
            },
          }
        );

        for (const sp of supplierProducts) {
          quotationSupplierProductsEntries.push({
            id: uuidv4(),
            quotationProductId: product.id,
            supplierId: sp.supplierId,
            unitPrice: sp.unit_price,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    // Transacción para insertar productos
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
      .json({ message: "Productos agregados a la cotización con éxito." });
  } catch (error) {
    console.error("Error al agregar productos a la cotización:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ------
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      attributes: ["id", "name"],
    });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ error: "Error al obtener proveedores." });
  }
};

const getSuppliersWithProducts = async (req, res) => {
  try {
    const { cartProducts } = req.body;

    // Validate cartProducts input
    if (!cartProducts || !Array.isArray(cartProducts)) {
      return res
        .status(400)
        .json({ error: "El carrito debe ser un array de productos." });
    }

    // Separate product and unit IDs
    const productIds = cartProducts.map((item) => item.productId);
    const unitIds = cartProducts.map((item) => item.unitId);

    // Fetch only missing products
    const suppliers = await Supplier.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.literal(`
          (
            SELECT COUNT(*)
            FROM UNNEST(
              ARRAY[${productIds.map(() => "?").join(",")}]::uuid[],
              ARRAY[${unitIds.map(() => "?").join(",")}]::uuid[]
            ) AS cart_products(product_id, unit_id)
            WHERE NOT EXISTS (
              SELECT 1
              FROM "SupplierProducts" sp
              WHERE sp."supplierId" = "Supplier"."id"
                AND sp."productId" = cart_products.product_id
                AND sp."unitOfMeasureId" = cart_products.unit_id
            )
          )
          `),
          "missing_products",
        ],
      ],
      replacements: [...productIds, ...unitIds],
      group: ["Supplier.id"],
      order: [[Sequelize.literal("missing_products"), "ASC"]],
    });

    const missingProducts = suppliers.map((supplier) => ({
      supplierId: supplier.id,
      supplierName: supplier.name,
      missingProducts: supplier.get("missing_products"),
    }));

    res.status(200).json(missingProducts);
  } catch (error) {
    console.error("Error al obtener los productos faltantes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createQuotation,
  addProductsToQuotation,
  addQuotationSupplierProducts,
  getSuppliers,
  getSuppliersWithProducts,
};
