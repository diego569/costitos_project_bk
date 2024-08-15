"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const quotationProducts = await queryInterface.sequelize.query(
      'SELECT id FROM "QuotationProducts";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );

    const quotationProductRows = quotationProducts[0];
    const supplierRows = suppliers[0];

    await queryInterface.bulkInsert("QuotationSupplierProducts", [
      {
        id: uuidv4(),
        quotationProductId: quotationProductRows[0].id,
        supplierId: supplierRows[0].id,
        unitPrice: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        quotationProductId: quotationProductRows[1].id,
        supplierId: supplierRows[1].id,
        unitPrice: 700,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateQuotationSupplierProducts = async () => {
      const quotationSupplierProducts = [];
      for (let i = 0; i < 500; i++) {
        const randomQuotationProductId =
          quotationProductRows[
            Math.floor(Math.random() * quotationProductRows.length)
          ].id;
        const randomSupplierId =
          supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
        quotationSupplierProducts.push({
          id: uuidv4(),
          quotationProductId: randomQuotationProductId,
          supplierId: randomSupplierId,
          unitPrice: fakerES.number.float({
            min: 10,
            max: 5000,
            precision: 0.01,
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return quotationSupplierProducts;
    };

    const quotationSupplierProductsData =
      await generateQuotationSupplierProducts();
    await queryInterface.bulkInsert(
      "QuotationSupplierProducts",
      quotationSupplierProductsData,
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuotationSupplierProducts", null, {});
  },
};
