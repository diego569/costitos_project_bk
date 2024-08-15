const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const getRecentProductsExplorar = async (req, res) => {
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
        ORDER BY
          p."createdAt" DESC
        LIMIT 10
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
    console.error("Error al obtener los productos recientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getCategories = async (req, res) => {
  try {
    // Utilizamos findAll para obtener todas las categorías
    const categories = await Category.findAll({
      attributes: ["id", "name", "slug", "photo"],
    });

    // Formateamos la respuesta según lo que necesites
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
const searchRecentProductsExplorar = async (req, res) => {
  const { query } = req.query;
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
        WHERE
          p.name ILIKE :query OR p.description ILIKE :query
        ORDER BY
          p."createdAt" DESC
        LIMIT 10
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
    console.error("Error al buscar productos recientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
module.exports = {
  getRecentProductsExplorar,
  getCategories,
  searchRecentProductsExplorar,
};
