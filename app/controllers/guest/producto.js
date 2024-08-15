const Category = require("../../models/category");
const Subcategory = require("../../models/subcategory");

const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const getProductDetailsBySupplierProductSlug = async (req, res) => {
  const { supplierProductSlug } = req.params;
  try {
    // Consulta principal para obtener detalles del producto y el vendedor usando el slug
    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        sp."productId" AS product_id, -- Necesario para la segunda consulta
        p.name AS product_name,
        p.description AS product_description,
        sp."unitOfMeasure" AS product_unit_of_measure,
        s.name AS supplier_name,
        s.phone AS supplier_phone,
        i.url AS product_photo
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Suppliers" s ON sp."supplierId" = s.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      WHERE
        sp.slug = :supplierProductSlug
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierProductSlug },
      }
    );

    const product = result[0]; // Asumimos que supplierProductSlug es único y devuelve un solo resultado

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Consulta para obtener las características del producto
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
        id: product.supplier_product_id,
        name: product.product_name,
        description: product.product_description,
        unitOfMeasure: product.product_unit_of_measure,
        supplierName: product.supplier_name,
        supplierPhone: product.supplier_phone,
        photo: product.product_photo,
        features: features,
      },
    });
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getProductDetailsBySupplierProductSlug,
};
