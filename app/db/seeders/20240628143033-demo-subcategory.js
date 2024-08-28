"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Categories";'
    );

    const categoryRows = categories[0];

    const otherCategory = categoryRows.find(
      (category) => category.name === "Otros"
    );

    const generateSlug = (name) => {
      return slugify(name, { lower: true });
    };

    const generateSubcategories = async () => {
      const subcategories = [];

      const otherSubcategory = {
        id: uuidv4(),
        name: "Otros",
        slug: generateSlug("Otros"),
        photo: fakerES.image.url(),
        categoryId: otherCategory.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      subcategories.push(otherSubcategory);

      for (let i = 0; i < 249; i++) {
        const randomCategory =
          categoryRows[Math.floor(Math.random() * categoryRows.length)];

        if (randomCategory.name === "Otros") continue;

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

    const subcategoriesData = await generateSubcategories();
    await queryInterface.bulkInsert("Subcategories", subcategoriesData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Subcategories", null, {});
  },
};
