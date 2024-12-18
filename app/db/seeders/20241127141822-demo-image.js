"use strict";

const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const generateImages = async () => {
      const images = [];
      for (let i = 0; i < 200; i++) {
        images.push({
          id: uuidv4(),
          url: faker.image.url({
            width: 640,
            height: 480,
            category: "abstract",
          }),
          filename: faker.system.fileName("jpg"),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return images;
    };

    const imagesData = await generateImages();

    await queryInterface.bulkInsert("Images", imagesData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Images", null, {});
  },
};
