"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Categories";'
    );
    const categoryRows = categories[0];
    const generateSlug = (name) => slugify(name, { lower: true });

    const subcategories = [
      {
        id: uuidv4(),
        name: "Cementos y Agregados",
        slug: generateSlug("Cementos y Agregados"),
        photo: faker.image.imageUrl(640, 480, "cement", true),
        categoryId: categoryRows.find(
          (category) => category.name === "Materiales de Construcción"
        ).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Acero de Refuerzo",
        slug: generateSlug("Acero de Refuerzo"),
        photo: faker.image.imageUrl(640, 480, "steel", true),
        categoryId: categoryRows.find(
          (category) => category.name === "Acero y Metales"
        ).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Pinturas Anticorrosivas",
        slug: generateSlug("Pinturas Anticorrosivas"),
        photo: faker.image.imageUrl(640, 480, "paint", true),
        categoryId: categoryRows.find(
          (category) => category.name === "Pinturas y Recubrimientos"
        ).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Herramientas Eléctricas",
        slug: generateSlug("Herramientas Eléctricas"),
        photo: faker.image.imageUrl(640, 480, "tools", true),
        categoryId: categoryRows.find(
          (category) => category.name === "Herramientas"
        ).id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Otros Materiales",
        slug: generateSlug("Otros Materiales"),
        photo: faker.image.imageUrl(640, 480, "miscellaneous", true),
        categoryId: categoryRows.find((category) => category.name === "Otros")
          .id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Subcategories", subcategories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Subcategories", null, {});
  },
};
