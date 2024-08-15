const Category = require("../../models/category");
const Subcategory = require("../../models/subcategory");

const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const searchSupplierProductsBySubcategory = async (req, res) => {
  const { subcategorySlug } = req.params;
  const { query } = req.query;
  try {
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
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sc.slug = :subcategorySlug
        AND (p.name ILIKE :query OR p.description ILIKE :query)
        AND sp."createdAt" = (
          SELECT MIN(sp_inner."createdAt")
          FROM public."SupplierProducts" sp_inner
          WHERE sp_inner."productId" = sp."productId"
          AND sp_inner."unitOfMeasure" = sp."unitOfMeasure"
        )
      ORDER BY
        sp."createdAt" DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { subcategorySlug, query: `%${query}%` },
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
    console.error("Error al buscar productos en la subcategoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getRecentSupplierProductsBySubcategory = async (req, res) => {
  const { subcategorySlug } = req.params;
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
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sc.slug = :subcategorySlug
      ORDER BY
        sp."productId", sp."unitOfMeasure", sp."createdAt" DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { subcategorySlug },
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
      "Error al obtener los productos recientes del proveedor en la subcategoría:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getMostQuotedProductsBySubcategory = async (req, res) => {
  const { subcategorySlug } = req.params;
  try {
    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        p.name AS product_name,
        sp.slug AS product_slug,
        p.description AS product_description,
        i.url AS product_photo,
        sp."unitOfMeasure" AS product_unit_of_measure,
        COUNT(qp."productId") AS quote_count
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."QuotationProducts" qp ON sp."productId" = qp."productId"
      WHERE
        sc.slug = :subcategorySlug
      GROUP BY
        sp.id, p.name, sp.slug, p.description, i.url, sp."unitOfMeasure"
      ORDER BY
        quote_count DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { subcategorySlug },
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
    console.error(
      "Error al obtener los productos más cotizados en la subcategoría:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  searchSupplierProductsBySubcategory,
  getRecentSupplierProductsBySubcategory,
  getMostQuotedProductsBySubcategory,
};
