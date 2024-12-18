"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener productos, proveedores y usuarios existentes
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

    // Validación de datos
    if (productRows.length === 0 || supplierRows.length === 0) {
      throw new Error(
        "No se encontraron productos o proveedores en la base de datos."
      );
    }

    // Crear datos fijos
    const fixedProductHistories = [
      {
        id: uuidv4(),
        productId: productRows[0].id,
        supplierId: supplierRows[0].id,
        action: "price change",
        previousPrice: 500.0,
        newPrice: 550.0,
        date: new Date("2024-01-01"),
        adminId: userRows[0]?.id || null,
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
        date: new Date("2024-01-15"),
        adminId: userRows[1]?.id || null,
        description: "Updated stock information",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Generar datos dinámicos
    const generateProductHistories = () => {
      const productHistories = [];

      for (let i = 0; i < 50; i++) {
        const randomProductId =
          productRows[Math.floor(Math.random() * productRows.length)].id;
        const randomSupplierId =
          supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
        const randomAdminId =
          userRows[Math.floor(Math.random() * userRows.length)].id;

        const action = faker.helpers.arrayElement([
          "price change",
          "stock update",
          "discontinued",
        ]);

        const previousPrice =
          action === "price change"
            ? faker.number.float({ min: 100, max: 3000, multipleOf: 0.01 })
            : null;
        const newPrice =
          action === "price change"
            ? faker.number.float({ min: 100, max: 3000, multipleOf: 0.01 })
            : null;

        productHistories.push({
          id: uuidv4(),
          productId: randomProductId,
          supplierId: randomSupplierId,
          action,
          previousPrice,
          newPrice,
          date: faker.date.recent({ days: 365, refDate: new Date() }),
          adminId: randomAdminId,
          description: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return productHistories;
    };

    const dynamicProductHistories = generateProductHistories();

    // Insertar datos en la tabla
    await queryInterface.bulkInsert(
      "ProductHistories",
      [...fixedProductHistories, ...dynamicProductHistories],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductHistories", null, {});
  },
};
