const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const searchSupplierProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp."unitOfMeasure" AS product_unit_of_measure,
        sp.slug AS supplier_product_slug,
        p.name AS product_name,
        p.description AS product_description,
        i.url AS product_photo,
        sp."createdAt" AS created_at
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        p.name ILIKE :query OR p.description ILIKE :query
      ORDER BY
        p.id, sp."createdAt" DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { query: `%${query}%` },
      }
    );

    const products = result.map((product) => ({
      id: product.supplier_product_id,
      name: product.product_name,
      description: product.product_description,
      slug: product.supplier_product_slug,
      photo: product.product_photo,
      unitOfMeasure: product.product_unit_of_measure,
    }));

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "slug", "photo"],
    });

    res.status(200).json({
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        photo: category.photo,
      })),
      count: categories.length,
    });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getRecentSupplierProducts = async (req, res) => {
  try {
    const supplierProducts = await sequelize.query(
      `
      SELECT DISTINCT ON (sp."productId", sp."unitOfMeasure")
        sp.id AS supplier_product_id,
        p.name AS product_name,
        p.description AS product_description,
        sp."unitOfMeasure" AS unit_of_measure,
        i.url AS product_image,
        sp.slug AS supplier_product_slug
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      ORDER BY
        sp."productId", sp."unitOfMeasure", sp."createdAt" DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      data: supplierProducts.map((sp) => ({
        id: sp.supplier_product_id,
        name: sp.product_name,
        description: sp.product_description,
        slug: sp.supplier_product_slug,
        photo: sp.product_image,
        unitOfMeasure: sp.unit_of_measure,
      })),
      count: supplierProducts.length,
    });
  } catch (error) {
    console.error(
      "Error al obtener los productos recientes del proveedor:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getMostQuotedProducts = async (req, res) => {
  try {
    const result = await sequelize.query(
      `
      SELECT
        sp."productId" AS product_id,
        p.name AS product_name,
        sp.slug AS product_slug,
        p.description AS product_description,
        i.url AS product_photo,
        sp.id AS supplier_product_id,
        sp."unitOfMeasure" AS product_unit_of_measure,
        COUNT(qp."productId") AS quote_count
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."QuotationProducts" qp ON sp."productId" = qp."productId"
      GROUP BY
        sp."productId", p.name, sp.slug, p.description, i.url, sp.id, sp."unitOfMeasure"
      ORDER BY
        quote_count DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const products = result.map((product) => ({
      id: product.supplier_product_id,
      name: product.product_name,
      description: product.product_description,
      slug: product.product_slug,
      photo: product.product_photo,
      unitOfMeasure: product.product_unit_of_measure,
    }));

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al obtener los productos más cotizados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  searchSupplierProducts,
  getCategories,
  getRecentSupplierProducts,
  getMostQuotedProducts,
};
