"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const generateFeatures = () => {
      const features = [];

      for (let i = 0; i < 30; i++) {
        features.push({
          id: uuidv4(),
          name: faker.commerce.productMaterial(),
          description: faker.lorem.sentence(), // Generar descripciones más variadas
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return features;
    };

    const featuresData = generateFeatures();
    await queryInterface.bulkInsert("Features", featuresData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Features", null, {});
  },
};
