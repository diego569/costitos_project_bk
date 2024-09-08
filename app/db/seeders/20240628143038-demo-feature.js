"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const generateFeatures = async () => {
      const features = [];
      for (let i = 0; i < 30; i++) {
        features.push({
          id: uuidv4(),
          name: fakerES.commerce.productMaterial(),
          description: fakerES.commerce.productDescription(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return features;
    };

    const featuresData = await generateFeatures();
    await queryInterface.bulkInsert("Features", featuresData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Features", null, {});
  },
};
