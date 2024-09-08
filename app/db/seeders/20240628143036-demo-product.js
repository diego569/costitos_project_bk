"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const subcategories = await queryInterface.sequelize.query(
      'SELECT id FROM "Subcategories";'
    );
    const images = await queryInterface.sequelize.query(
      'SELECT id FROM "Images";'
    );

    const subcategoryRows = subcategories[0];
    const imageRows = images[0];

    const generateSlug = (name) => {
      return slugify(name, { lower: true });
    };

    const generateProducts = async () => {
      const products = [];
      for (let i = 0; i < 200; i++) {
        const randomSubcategoryId =
          subcategoryRows[Math.floor(Math.random() * subcategoryRows.length)]
            .id;

        const randomImageId =
          imageRows[Math.floor(Math.random() * imageRows.length)].id;

        const productName = fakerES.commerce.productName();
        products.push({
          id: uuidv4(),
          name: productName,
          slug: generateSlug(productName),
          description: fakerES.commerce.productDescription(),
          imageId: randomImageId,
          subcategoryId: randomSubcategoryId,
          status: fakerES.helpers.arrayElement(["available", "unavailable"]),
          supplierId: null,
          adminAuthorizedId: null,
          creationDate: new Date(),
          authorizationDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return products;
    };

    const productsData = await generateProducts();
    await queryInterface.bulkInsert("Products", productsData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
