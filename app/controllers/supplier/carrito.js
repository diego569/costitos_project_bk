const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const addSupplierProducts = async (req, res) => {
  const { userId, products } = req.body;

  try {
    // Crear las entradas para SupplierProducts
    const supplierProductsEntries = products.map((product) => ({
      id: uuidv4(),
      supplierId: userId, // Usar el userId recibido en la solicitud
      productId: product.productId,
      slug: `${product.productId}-${product.unitOfMeasure}`
        .toLowerCase()
        .replace(/ /g, "-"),
      price: product.price,
      unitOfMeasure: product.unitOfMeasure,
      status: "active", // Puedes ajustar esto según tus necesidades
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insertar las entradas en la tabla SupplierProducts
    await sequelize.transaction(async (transaction) => {
      for (const entry of supplierProductsEntries) {
        await sequelize.query(
          `
            INSERT INTO "SupplierProducts" (id, "supplierId", "productId", slug, price, "unitOfMeasure", status, "createdAt", "updatedAt")
            VALUES (:id, :supplierId, :productId, :slug, :price, :unitOfMeasure, :status, NOW(), NOW())
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
