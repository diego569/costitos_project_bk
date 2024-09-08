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

module.exports = {
  getProductFeaturesByProductId,
};
