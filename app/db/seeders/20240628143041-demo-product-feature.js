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

    await queryInterface.bulkInsert("ProductFeatures", [
      {
        id: uuidv4(),
        productId: productRows[0].id,
        featureId: featureRows[0].id,
        value: "2kg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productRows[1].id,
        featureId: featureRows[1].id,
        value: "50x50x70cm",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateProductFeatures = async () => {
      const productFeatures = [];
      for (let i = 0; i < 100; i++) {
        const randomProductId =
          productRows[Math.floor(Math.random() * productRows.length)].id;
        const randomFeatureId =
          featureRows[Math.floor(Math.random() * featureRows.length)].id;
        productFeatures.push({
          id: uuidv4(),
          productId: randomProductId,
          featureId: randomFeatureId,
          value: fakerES.commerce.productAdjective(),
          createdAt: new Date(),
          updatedAt: new Date(),
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
