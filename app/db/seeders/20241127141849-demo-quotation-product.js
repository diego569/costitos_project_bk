"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener cotizaciones y productos existentes
    const quotations = await queryInterface.sequelize.query(
      'SELECT id FROM "Quotations";'
    );
    const products = await queryInterface.sequelize.query(
      'SELECT id FROM "Products";'
    );

    const quotationRows = quotations[0];
    const productRows = products[0];

    // Validación de datos
    if (quotationRows.length === 0 || productRows.length === 0) {
      throw new Error(
        "No se encontraron cotizaciones o productos en la base de datos."
      );
    }

    // Crear cotizaciones específicas
    const fixedQuotationProducts = [
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
    ];

    // Generar relaciones dinámicas
    const generateQuotationProducts = () => {
      const quotationProducts = [];

      // Determinar el número de productos por cotización
      quotationRows.forEach((quotation) => {
        const numProducts = faker.number.int({ min: 3, max: 7 }); // Cada cotización tendrá entre 3 y 7 productos

        const selectedProducts = faker.helpers.arrayElements(
          productRows,
          numProducts
        );

        selectedProducts.forEach((product) => {
          quotationProducts.push({
            id: uuidv4(),
            quotationId: quotation.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 50 }),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      });

      return quotationProducts;
    };

    const dynamicQuotationProducts = generateQuotationProducts();

    // Insertar datos en la tabla
    await queryInterface.bulkInsert(
      "QuotationProducts",
      [...fixedQuotationProducts, ...dynamicQuotationProducts],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuotationProducts", null, {});
  },
};
