const Category = require("../../models/category");
const Subcategory = require("../../models/subcategory");

const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const getProductDetailsBySupplierProductSlug = async (req, res) => {
  const { supplierProductSlug } = req.params;
  try {
    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp."productId" AS product_id,  
        p.name AS product_name,
        p.description AS product_description,
        uom.name AS product_unit_of_measure, 
        s.name AS supplier_name,
        s.phone AS supplier_phone,
        i.url AS product_photo,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized   
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Suppliers" s ON sp."supplierId" = s.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  
      WHERE
        sp.slug = :supplierProductSlug
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierProductSlug },
      }
    );

    const product = result[0];

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const featuresResult = await sequelize.query(
      `
      SELECT
        f.id AS feature_id,
        f.name AS feature_name,
        f.description AS feature_description,
        pf.value AS feature_value
      FROM
        public."ProductFeatures" pf
      JOIN
        public."Features" f ON pf."featureId" = f.id
      WHERE
        pf."productId" = :productId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { productId: product.product_id },
      }
    );

    const features = featuresResult.map((feature) => ({
      id: feature.feature_id,
      name: feature.feature_name,
      description: feature.feature_description,
      value: feature.feature_value,
    }));

    res.status(200).json({
      data: {
        supplierProductId: product.supplier_product_id,
        productId: product.product_id,
        name: product.product_name,
        description: product.product_description,
        unitOfMeasure: product.product_unit_of_measure,
        supplierName: product.supplier_name,
        supplierPhone: product.supplier_phone,
        photo: product.product_photo,
        isAuthorized: product.is_authorized,
        features: features,
      },
    });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getProductCategoryAndSubcategoryByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const categoryResult = await sequelize.query(
      `
        SELECT
          c.id AS category_id,
          c.name AS category_name,
          c.slug AS category_slug,
          sc.id AS subcategory_id,
          sc.name AS subcategory_name,
          sc.slug AS subcategory_slug
        FROM
          public."Products" p
        LEFT JOIN
          public."Subcategories" sc ON p."subcategoryId" = sc.id
        LEFT JOIN
          public."Categories" c ON sc."categoryId" = c.id
        WHERE
          p.id = :productId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { productId },
      }
    );

    if (categoryResult.length === 0) {
      return res.status(404).json({
        error:
          "No se encontraron la categoría y subcategoría para este producto",
      });
    }

    const categoryData = {
      category: {
        id: categoryResult[0].category_id,
        name: categoryResult[0].category_name,
        slug: categoryResult[0].category_slug,
      },
      subcategory: {
        id: categoryResult[0].subcategory_id,
        name: categoryResult[0].subcategory_name,
        slug: categoryResult[0].subcategory_slug,
      },
    };

    res.status(200).json(categoryData);
  } catch (error) {
    console.error(
      "Error al obtener la categoría y subcategoría del producto:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getProductDetailsBySupplierProductSlug,
  getProductCategoryAndSubcategoryByProductId,
};
