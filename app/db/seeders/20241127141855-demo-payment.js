"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
const { DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener usuarios existentes
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );

    const userRows = users[0];

    // Validación de datos
    if (userRows.length === 0) {
      throw new Error("No se encontraron usuarios en la base de datos.");
    }

    // Crear datos específicos
    const fixedPayments = [
      {
        id: uuidv4(),
        userId: userRows[0].id,
        amount: 1000.0,
        date: new Date("2024-01-10"),
        paymentType: "credit",
        adminAuthorizedId: userRows[1]?.id || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: userRows[1].id,
        amount: 2000.0,
        date: new Date("2024-02-15"),
        paymentType: "debit",
        adminAuthorizedId: userRows[2]?.id || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Generar datos dinámicos
    const generatePayments = () => {
      const payments = [];

      for (let i = 0; i < 50; i++) {
        const randomUserId =
          userRows[Math.floor(Math.random() * userRows.length)].id;

        const randomAdminAuthorizedId =
          Math.random() < 0.5
            ? userRows[Math.floor(Math.random() * userRows.length)].id
            : null;

        payments.push({
          id: uuidv4(),
          userId: randomUserId,
          amount: faker.number.float({ min: 10, max: 5000, multipleOf: 0.01 }),
          date: faker.date.between({
            from: Date("2023-01-01"),
            to: Date("2024-12-31"),
          }),
          paymentType: faker.helpers.arrayElement(["credit", "debit"]),
          adminAuthorizedId: randomAdminAuthorizedId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return payments;
    };

    const dynamicPayments = generatePayments();

    // Insertar datos en la tabla
    await queryInterface.bulkInsert(
      "Payments",
      [...fixedPayments, ...dynamicPayments],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Payments", null, {});
  },
};
