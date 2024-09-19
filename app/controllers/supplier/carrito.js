const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const addSupplierProducts = async (req, res) => {
  const { userId, products } = req.body;

  try {
    // Ensure that each product includes a valid unitOfMeasureId
    const supplierProductsEntries = products.map((product) => {
      if (!product.unitOfMeasureId) {
        throw new Error(
          "Unidad de medida (unitOfMeasureId) es requerida para cada producto."
        );
      }

      return {
        id: uuidv4(),
        supplierId: userId,
        productId: product.productId,
        slug: `${product.productId}-${product.unitOfMeasureId}`
          .toLowerCase()
          .replace(/ /g, "-"),
        price: product.price,
        unitOfMeasureId: product.unitOfMeasureId,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await sequelize.transaction(async (transaction) => {
      for (const entry of supplierProductsEntries) {
        await sequelize.query(
          `
            INSERT INTO "SupplierProducts" (id, "supplierId", "productId", slug, price, "unitOfMeasureId", status, "createdAt", "updatedAt")
            VALUES (:id, :supplierId, :productId, :slug, :price, :unitOfMeasureId, :status, NOW(), NOW())
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
      message: "Productos de proveedor agregados con éxito",
      data: supplierProductsEntries,
    });
  } catch (error) {
    console.error("Error al agregar productos de proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  addSupplierProducts,
};
