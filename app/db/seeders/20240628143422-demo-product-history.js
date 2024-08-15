"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM "Products";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );

    const productRows = products[0];
    const supplierRows = suppliers[0];
    const userRows = users[0];

    await queryInterface.bulkInsert("ProductHistories", [
      {
        id: uuidv4(),
        productId: productRows[0].id,
        supplierId: supplierRows[0].id,
        action: "price change",
        previousPrice: 500,
        newPrice: 550,
        date: new Date(),
        adminId: userRows[0].id,
        description: "Changed price from 500 to 550",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        productId: productRows[1].id,
        supplierId: supplierRows[1].id,
        action: "stock update",
        previousPrice: null,
        newPrice: null,
        date: new Date(),
        adminId: userRows[1].id,
        description: "Updated stock information",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateProductHistories = async () => {
      const productHistories = [];
      for (let i = 0; i < 50; i++) {
        const randomProductId =
          productRows[Math.floor(Math.random() * productRows.length)].id;
        const randomSupplierId =
          supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
        const randomAdminId =
          userRows[Math.floor(Math.random() * userRows.length)].id;
        productHistories.push({
          id: uuidv4(),
          productId: randomProductId,
          supplierId: randomSupplierId,
          action: fakerES.helpers.arrayElement([
            "price change",
            "stock update",
          ]),
          previousPrice: fakerES.number.float({
            min: 100,
            max: 5000,
            precision: 0.01,
          }),
          newPrice: fakerES.number.float({
            min: 100,
            max: 5000,
            precision: 0.01,
          }),
          date: new Date(),
          adminId: randomAdminId,
          description: fakerES.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return productHistories;
    };

    const productHistoriesData = await generateProductHistories();
    await queryInterface.bulkInsert(
      "ProductHistories",
      productHistoriesData,
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductHistories", null, {});
  },
};
