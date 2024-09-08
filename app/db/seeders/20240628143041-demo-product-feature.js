"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM "Products";'
    );
    const features = await queryInterface.sequelize.query(
      'SELECT id FROM "Features";'
    );

    const productRows = products[0];
    const featureRows = features[0];

    const generateProductFeatures = async () => {
      const productFeatures = [];
      for (let i = 0; i < productRows.length; i++) {
        // Para cada producto, asignar entre 5 y 10 características
        const numFeatures = fakerES.datatype.number({ min: 5, max: 10 });
        const randomFeatures = fakerES.helpers.arrayElements(
          featureRows,
          numFeatures
        );

        randomFeatures.forEach((feature) => {
          productFeatures.push({
            id: uuidv4(),
            productId: productRows[i].id,
            featureId: feature.id,
            value: fakerES.commerce.productAdjective(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
      return productFeatures;
    };

    const productFeaturesData = await generateProductFeatures();
    await queryInterface.bulkInsert("ProductFeatures", productFeaturesData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductFeatures", null, {});
  },
};
