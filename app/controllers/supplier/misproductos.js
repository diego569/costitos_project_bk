const { Sequelize, Op } = require("sequelize");
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
        ORDER BY
          c.name ASC
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
      ORDER BY
        s.name ASC
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

const getProductsBySupplier = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp.price,
        sp."unitOfMeasure",
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt"
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sp."supplierId" = :supplierId
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId },
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

const getProductsBySupplierAndCategory = async (req, res) => {
  const { supplierId, categoryId } = req.params;

  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp.price,
        sp."unitOfMeasure",
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt"
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      JOIN
        public."Subcategories" s ON p."subcategoryId" = s.id
      WHERE
        sp."supplierId" = :supplierId
        AND s."categoryId" = :categoryId
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, categoryId },
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

const getProductsBySupplierAndSubcategory = async (req, res) => {
  const { supplierId, subcategoryId } = req.params;

  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp.price,
        sp."unitOfMeasure",
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt"
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sp."supplierId" = :supplierId
        AND p."subcategoryId" = :subcategoryId
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, subcategoryId },
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

const searchProductsBySupplier = async (req, res) => {
  const { supplierId } = req.params;
  const { query } = req.query;

  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp.price,
        sp."unitOfMeasure",
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt"
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sp."supplierId" = :supplierId
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, query: `%${query}%` },
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

const searchProductsBySupplierAndCategory = async (req, res) => {
  const { supplierId, categoryId } = req.params;
  const { query } = req.query;

  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp.price,
        sp."unitOfMeasure",
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt"
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      JOIN
        public."Subcategories" s ON p."subcategoryId" = s.id
      WHERE
        sp."supplierId" = :supplierId
        AND s."categoryId" = :categoryId
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, categoryId, query: `%${query}%` },
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

const searchProductsBySupplierAndSubcategory = async (req, res) => {
  const { supplierId, subcategoryId } = req.params;
  const { query } = req.query;

  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp.price,
        sp."unitOfMeasure",
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt"
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sp."supplierId" = :supplierId
        AND p."subcategoryId" = :subcategoryId
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, subcategoryId, query: `%${query}%` },
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

const getCategories = async (req, res) => {
  try {
    const categories = await sequelize.query(
      `
      SELECT id, name
      FROM public."Categories"
      ORDER BY name ASC
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
      ORDER BY name ASC
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

const Category = require("../../models/category");
const slugify = require("slugify");

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const slug = slugify(name, { lower: true });

    const newCategory = await Category.create({
      name,
      slug,
    });

    res.status(201).json({ category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const Subcategory = require("../../models/subcategory");

const createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;

  try {
    const slug = slugify(name, { lower: true });

    const newSubcategory = await Subcategory.create({
      name,
      slug,
      categoryId,
    });

    res.status(201).json({ subcategory: newSubcategory });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
module.exports = {
  getCategoriesBySupplier,
  getSubcategoriesBySupplierAndCategory,
  getProductsBySupplier,
  getProductsBySupplierAndCategory,
  getProductsBySupplierAndSubcategory,
  searchProductsBySupplier,
  searchProductsBySupplierAndCategory,
  searchProductsBySupplierAndSubcategory,
  getCategories,
  getSubcategoriesByCategoryId,
  createCategory,
  createSubcategory,
};
