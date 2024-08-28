"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const generateSlug = (name) => {
      return slugify(name, { lower: true });
    };

    const generateCategories = async () => {
      const categories = [];

      const otherCategory = {
        id: uuidv4(),
        name: "Otros",
        slug: generateSlug("Otros"),
        photo: fakerES.image.url(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      categories.push(otherCategory);

      for (let i = 0; i < 24; i++) {
        const categoryName = fakerES.commerce.department();
        categories.push({
          id: uuidv4(),
          name: categoryName,
          slug: generateSlug(categoryName),
          photo: fakerES.image.url(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return categories;
    };

    const categoriesData = await generateCategories();
    await queryInterface.bulkInsert("Categories", categoriesData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
