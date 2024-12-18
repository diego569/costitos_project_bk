"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener productos y características existentes
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM "Products";'
    );
    const features = await queryInterface.sequelize.query(
      'SELECT id FROM "Features";'
    );

    const productRows = products[0];
    const featureRows = features[0];

    // Validación de datos
    if (productRows.length === 0 || featureRows.length === 0) {
      throw new Error(
        "No se encontraron productos o características en la base de datos."
      );
    }

    // Generar características para productos
    const generateProductFeatures = () => {
      const productFeatures = [];

      productRows.forEach((product) => {
        // Determinar el número de características para el producto
        const numFeatures = faker.number.int({ min: 5, max: 10 });
        const selectedFeatures = faker.helpers.arrayElements(
          featureRows,
          numFeatures
        );

        // Crear registros para las características seleccionadas
        selectedFeatures.forEach((feature) => {
          productFeatures.push({
            id: uuidv4(),
            productId: product.id,
            featureId: feature.id,
            value: faker.commerce.productAdjective(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      });

      return productFeatures;
    };

    const productFeaturesData = generateProductFeatures();
    await queryInterface.bulkInsert("ProductFeatures", productFeaturesData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductFeatures", null, {});
  },
};
