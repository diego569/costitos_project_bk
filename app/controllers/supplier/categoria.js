const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const Subcategory = require("../../models/subcategory");
const sequelize = new Sequelize(config.development);

const getSubcategoriesByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug },
      attributes: ["id", "name", "slug"],
      include: {
        model: Subcategory,
        as: "subcategories",
        attributes: ["name", "slug", "photo"],
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const data = category.subcategories.map((subcategory) => ({
      name: subcategory.name,
      slug: subcategory.slug,
      photo: subcategory.photo,
    }));

    res.status(200).json({
      category: {
        name: category.name,
        slug: category.slug,
      },
      data,
    });
  } catch (error) {
    console.error("Error al obtener las subcategorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getRecentProductsByCategory = async (req, res) => {
  const { categorySlug } = req.params;
  try {
    const products = await sequelize.query(
      `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        i.url AS photo
      FROM
        public."Products" p
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      JOIN
        public."Subcategories" s ON p."subcategoryId" = s.id
      JOIN
        public."Categories" c ON s."categoryId" = c.id
      WHERE
        c.slug = :categorySlug
      ORDER BY
        p."createdAt" DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categorySlug },
      }
    );

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al obtener los productos recientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const searchRecentProductsByCategory = async (req, res) => {
  const { categorySlug } = req.params;
  const { query } = req.query;

  try {
    const result = await sequelize.query(
      `
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.slug AS product_slug,
        p.description AS product_description,
        i.url AS product_photo,
        p."createdAt" AS created_at
      FROM
        public."Products" p
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      JOIN
        public."Subcategories" s ON p."subcategoryId" = s.id
      JOIN
        public."Categories" c ON s."categoryId" = c.id
      WHERE
        c.slug = :categorySlug
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        p."createdAt" DESC
      LIMIT 10
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categorySlug, query: `%${query}%` },
      }
    );

    const products = result.map((product) => ({
      id: product.product_id,
      name: product.product_name,
      description: product.product_description,
      slug: product.product_slug,
      photo: product.product_photo,
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
module.exports = {
  searchRecentProductsByCategory,
  getSubcategoriesByCategorySlug,
  getRecentProductsByCategory,
};
