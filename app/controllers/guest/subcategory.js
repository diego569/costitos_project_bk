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
        uom.name AS product_unit_of_measure,   
        sp.slug AS supplier_product_slug,
        p.name AS product_name,
        p.description AS product_description,
        i.url AS product_photo,
        sp."createdAt" AS created_at,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
      WHERE
        sc.slug = :subcategorySlug
        AND (p.name ILIKE :query OR p.description ILIKE :query)
        AND sp."createdAt" = (
          SELECT MIN(sp_inner."createdAt")
          FROM public."SupplierProducts" sp_inner
          WHERE sp_inner."productId" = sp."productId"
          AND sp_inner."unitOfMeasureId" = sp."unitOfMeasureId"
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
      isAuthorized: product.is_authorized,
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
      SELECT
        sp.id AS supplier_product_id,
        p.name AS product_name,
        p.description AS product_description,
        uom.name AS unit_of_measure,   
        i.url AS product_image,
        sp.slug AS supplier_product_slug,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized   
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
      WHERE
        sc.slug = :subcategorySlug
      ORDER BY
        sp."createdAt" DESC
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
        isAuthorized: sp.is_authorized,
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
        uom.name AS product_unit_of_measure,  
        COUNT(qp."productId") AS quote_count,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  
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
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
      WHERE
        sc.slug = :subcategorySlug
      GROUP BY
        sp.id, p.name, sp.slug, p.description, i.url, uom.name  
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
      isAuthorized: product.is_authorized,
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

const getSubcategoryDetailsBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [subcategoryDetails] = await sequelize.query(
      `
      SELECT 
        s.name AS subcategory_name,
        s.slug AS subcategory_slug,
        c.name AS category_name,
        c.slug AS category_slug
      FROM 
        public."Subcategories" s
      JOIN 
        public."Categories" c ON s."categoryId" = c.id
      WHERE 
        s.slug = :slug
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { slug },
      }
    );

    if (!subcategoryDetails) {
      return res.status(404).json({ error: "Subcategoría no encontrada" });
    }

    res.status(200).json({
      subcategory: {
        name: subcategoryDetails.subcategory_name,
        slug: subcategoryDetails.subcategory_slug,
      },
      category: {
        name: subcategoryDetails.category_name,
        slug: subcategoryDetails.category_slug,
      },
    });
  } catch (error) {
    console.error("Error al obtener los detalles de la subcategoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  searchSupplierProductsBySubcategory,
  getRecentSupplierProductsBySubcategory,
  getMostQuotedProductsBySubcategory,
  getSubcategoryDetailsBySlug,
};
