"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM "Categories";'
    );

    const categoryRows = categories[0];

    // Función para generar el slug
    const generateSlug = (name) => {
      return slugify(name, { lower: true });
    };

    // Función para generar subcategorías aleatorias
    const generateSubcategories = async () => {
      const subcategories = [];
      for (let i = 0; i < 250; i++) {
        const randomCategory =
          categoryRows[Math.floor(Math.random() * categoryRows.length)];
        const subCategoryName = fakerES.commerce.productName();
        subcategories.push({
          id: uuidv4(),
          name: subCategoryName,
          slug: generateSlug(subCategoryName),
          photo: fakerES.image.url(),
          categoryId: randomCategory.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return subcategories;
    };

    // Generar subcategorías aleatorias y insertar en la base de datos
    const subcategoriesData = await generateSubcategories();
    await queryInterface.bulkInsert("Subcategories", subcategoriesData);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar todas las subcategorías
    await queryInterface.bulkDelete("Subcategories", null, {});
  },
};
