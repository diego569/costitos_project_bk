const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const getProductFeaturesByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
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
        replacements: { productId },
      }
    );

    if (featuresResult.length === 0) {
      return res.status(404).json({
        error: "No se encontraron características para este producto",
      });
    }

    const features = featuresResult.map((feature) => ({
      id: feature.feature_id,
      name: feature.feature_name,
      description: feature.feature_description,
      value: feature.feature_value,
    }));

    res.status(200).json({ features });
  } catch (error) {
    console.error("Error al obtener las características del producto:", error);
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
  getProductFeaturesByProductId,
  getProductCategoryAndSubcategoryByProductId,
};
