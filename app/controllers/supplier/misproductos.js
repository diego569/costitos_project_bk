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
        uom.name AS unit_of_measure,  
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt",
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized 
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
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
        uom.name AS unit_of_measure,  
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt",
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id 
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
        uom.name AS unit_of_measure,  
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt",
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id 
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
        uom.name AS unit_of_measure,  
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt",
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
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
        uom.name AS unit_of_measure,  
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt",
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized 
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id 
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
        uom.name AS unit_of_measure, 
        p.id AS product_id,
        p.name,
        p.description,
        i.url AS photo,
        sp.slug AS product_slug,
        sp."createdAt",
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized 
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
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
const Subcategory = require("../../models/subcategory");
const slugify = require("slugify");

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const slug = slugify(name, { lower: true });

    const newCategory = await Category.create({
      name,
      slug,
    });

    const otherSubcategory = await Subcategory.create({
      name: "Otros",
      slug: slugify("Otros", { lower: true }),
      categoryId: newCategory.id,
    });

    res.status(201).json({
      category: newCategory,
      subcategory: otherSubcategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

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

const UnitOfMeasure = require("../../models/unitofmeasure");

const getUnitOfMeasures = async (req, res) => {
  try {
    const unitsOfMeasure = await UnitOfMeasure.findAll({
      attributes: ["id", "value", "name"],
    });

    res.status(200).json({
      data: unitsOfMeasure.map((unit) => ({
        id: unit.id,
        value: unit.value,
        name: unit.name,
      })),
      count: unitsOfMeasure.length,
    });
  } catch (error) {
    console.error("Error al obtener las unidades de medida:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const createUnitOfMeasure = async (req, res) => {
  try {
    const { value, name } = req.body;

    if (!value || !name) {
      return res
        .status(400)
        .json({ error: "Both value and name are required." });
    }

    const unitOfMeasure = await UnitOfMeasure.create({ value, name });

    res.status(201).json({ unitOfMeasure });
  } catch (error) {
    console.error("Error creating unit of measure:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll();
    return res.status(200).json({ data: features });
  } catch (error) {
    console.error("Error al obtener características:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const Feature = require("../../models/feature");
const ProductFeature = require("../../models/productfeature");

const createFeature = async (req, res) => {
  const { name, description } = req.body;
  try {
    const feature = await Feature.create({ name, description });
    return res.status(201).json({ feature });
  } catch (error) {
    console.error("Error al crear característica:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const addProductFeature = async (req, res) => {
  const { productId, featureId, value } = req.body;
  try {
    const productFeature = await ProductFeature.create({
      productId,
      featureId,
      value,
    });
    return res.status(201).json({ productFeature });
  } catch (error) {
    console.error("Error al agregar característica al producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const addFeatureToProduct = async (req, res) => {
  const { productId, featureId, value } = req.body;

  try {
    if (!productId || !featureId || !value) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Crear la nueva entrada en la tabla ProductFeatures
    const productFeature = await ProductFeature.create({
      productId,
      featureId,
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      message: "Característica asignada al producto con éxito",
      data: productFeature,
    });
  } catch (error) {
    console.error("Error al asignar característica al producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
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
  getUnitOfMeasures,
  createUnitOfMeasure,
  getFeatures,
  createFeature,
  addProductFeature,
  addFeatureToProduct,
};
