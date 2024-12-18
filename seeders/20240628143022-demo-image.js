"use strict";

const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Function to generate images data
    const generateImages = async () => {
      const images = [];
      for (let i = 0; i < 500; i++) {
        images.push({
          id: uuidv4(),
          url: fakerES.image.url(),
          filename: fakerES.image.url(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return images;
    };

    // Generate image data
    const imagesData = await generateImages();

    // Insert seed data into the Images table
    await queryInterface.bulkInsert("Images", imagesData);
  },

  async down(queryInterface, Sequelize) {
    // Remove all seed data from the Images table
    await queryInterface.bulkDelete("Images", null, {});
  },
};
