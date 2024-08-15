"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const quotations = await queryInterface.sequelize.query(
      'SELECT id FROM "Quotations";'
    );
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM "Products";'
    );

    const quotationRows = quotations[0];
    const productRows = products[0];

    await queryInterface.bulkInsert("QuotationProducts", [
      {
        id: uuidv4(),
        quotationId: quotationRows[0].id,
        productId: productRows[0].id,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        quotationId: quotationRows[1].id,
        productId: productRows[1].id,
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateQuotationProducts = async () => {
      const quotationProducts = [];
      for (let i = 0; i < 500; i++) {
        const randomQuotationId =
          quotationRows[Math.floor(Math.random() * quotationRows.length)].id;
        const randomProductId =
          productRows[Math.floor(Math.random() * productRows.length)].id;
        quotationProducts.push({
          id: uuidv4(),
          quotationId: randomQuotationId,
          productId: randomProductId,
          quantity: fakerES.number.int({ min: 1, max: 50 }),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return quotationProducts;
    };

    const quotationProductsData = await generateQuotationProducts();
    await queryInterface.bulkInsert(
      "QuotationProducts",
      quotationProductsData,
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuotationProducts", null, {});
  },
};
