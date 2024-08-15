const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const getCategoriesBySupplier = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const categories = await sequelize.query(
      `
        SELECT DISTINCT
          c.id AS category_id,
          c.name AS category_name,
          c.slug AS category_slug,
          c.photo AS category_photo
        FROM
          public."SupplierProducts" sp
        JOIN
          public."Products" p ON sp."productId" = p.id
        JOIN
          public."Subcategories" sc ON p."subcategoryId" = sc.id
        JOIN
          public."Categories" c ON sc."categoryId" = c.id
        WHERE
          sp."supplierId" = :supplierId
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId },
      }
    );

    res.status(200).json({
      data: categories.map((category) => ({
        id: category.category_id,
        name: category.category_name,
        slug: category.category_slug,
        photo: category.category_photo,
      })),
      count: categories.length,
    });
  } catch (error) {
    console.error("Error al obtener las categorías del proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getSubcategoriesBySupplierAndCategory = async (req, res) => {
  const { supplierId, categoryId } = req.params;

  try {
    const subcategories = await sequelize.query(
      `
      SELECT DISTINCT
        s.id,
        s.name,
        s.slug,
        s.photo
      FROM
        public."Subcategories" s
      JOIN
        public."Products" p ON p."subcategoryId" = s.id
      JOIN
        public."SupplierProducts" sp ON sp."productId" = p.id
      WHERE
        sp."supplierId" = :supplierId
        AND s."categoryId" = :categoryId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, categoryId },
      }
    );

    res.status(200).json({
      data: subcategories,
      count: subcategories.length,
    });
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await sequelize.query(
      `
        SELECT
          p.id AS product_id,
          p.name,
          p.description,
          p.slug,
          p.status,
          i.url AS photo
        FROM
          public."Products" p
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await sequelize.query(
      `
        SELECT
          p.id AS product_id,
          p.name,
          p.description,
          p.slug,
          p.status,
          i.url AS photo
        FROM
          public."Products" p
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        JOIN
          public."Subcategories" s ON p."subcategoryId" = s.id
        WHERE
          s."categoryId" = :categoryId
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryId },
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getProductsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params;

  try {
    const products = await sequelize.query(
      `
        SELECT
          p.id AS product_id,
          p.name,
          p.description,
          p.slug,
          p.status,
          i.url AS photo
        FROM
          public."Products" p
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        WHERE
          p."subcategoryId" = :subcategoryId
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { subcategoryId },
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  try {
    const products = await sequelize.query(
      `
        SELECT
          p.id AS product_id,
          p.name,
          p.description,
          p.slug,
          p.status,
          i.url AS photo
        FROM
          public."Products" p
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        WHERE
          p.name ILIKE :query OR p.description ILIKE :query
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { query: `%${query}%` },
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const searchProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { query } = req.query;

  try {
    const products = await sequelize.query(
      `
        SELECT
          p.id AS product_id,
          p.name,
          p.description,
          p.slug AS product_slug,
          p.status,
          i.url AS photo
        FROM
          public."Products" p
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        JOIN
          public."Subcategories" s ON p."subcategoryId" = s.id
        WHERE
          s."categoryId" = :categoryId
          AND (p.name ILIKE :query OR p.description ILIKE :query)
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryId, query: `%${query}%` },
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const searchProductsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params;
  const { query } = req.query;

  try {
    const products = await sequelize.query(
      `
        SELECT
          p.id AS product_id,
          p.name,
          p.description,
          p.slug AS product_slug,
          p.status,
          i.url AS photo
        FROM
          public."Products" p
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        WHERE
          p."subcategoryId" = :subcategoryId
          AND (p.name ILIKE :query OR p.description ILIKE :query)
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { subcategoryId, query: `%${query}%` },
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//

const getCategories = async (req, res) => {
  try {
    const categories = await sequelize.query(
      `
      SELECT id, name
      FROM public."Categories"
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getSubcategoriesByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const subcategories = await sequelize.query(
      `
      SELECT id, name
      FROM public."Subcategories"
      WHERE "categoryId" = :categoryId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryId },
      }
    );

    res.status(200).json({ data: subcategories });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
module.exports = {
  getCategoriesBySupplier,
  getSubcategoriesBySupplierAndCategory,
  getAllProducts,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts,
  searchProductsByCategory,
  searchProductsBySubcategory,
  getCategories,
  getSubcategoriesByCategoryId,
};
