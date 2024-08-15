"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Features", [
      {
        id: uuidv4(),
        name: "Weight",
        description: "ancho",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Dimensions",
        description: "da",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateFeatures = async () => {
      const features = [];
      for (let i = 0; i < 20; i++) {
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
