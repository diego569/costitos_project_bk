"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const generateSlug = (name) => slugify(name, { lower: true });

    const categories = [
      {
        id: uuidv4(),
        name: "Materiales de Construcción",
        slug: generateSlug("Materiales de Construcción"),
        photo: faker.image.imageUrl(640, 480, "construction", true),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Acero y Metales",
        slug: generateSlug("Acero y Metales"),
        photo: faker.image.imageUrl(640, 480, "metal", true),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Pinturas y Recubrimientos",
        slug: generateSlug("Pinturas y Recubrimientos"),
        photo: faker.image.imageUrl(640, 480, "paint", true),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Herramientas",
        slug: generateSlug("Herramientas"),
        photo: faker.image.imageUrl(640, 480, "tools", true),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Otros",
        slug: generateSlug("Otros"),
        photo: faker.image.imageUrl(640, 480, "miscellaneous", true),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Categories", categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
