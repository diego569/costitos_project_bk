"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );

    const userRows = users[0];

    await queryInterface.bulkInsert("Payments", [
      {
        id: uuidv4(),
        userId: userRows[0].id,
        amount: 1000,
        date: new Date(),
        paymentType: "credit",
        adminAuthorizedId: userRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: userRows[1].id,
        amount: 2000,
        date: new Date(),
        paymentType: "debit",
        adminAuthorizedId: userRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generatePayments = async () => {
      const payments = [];
      for (let i = 0; i < 50; i++) {
        const randomUserId =
          userRows[Math.floor(Math.random() * userRows.length)].id;
        payments.push({
          id: uuidv4(),
          userId: randomUserId,
          amount: fakerES.number.float({ min: 10, max: 5000, precision: 0.01 }),
          date: new Date(),
          paymentType: fakerES.helpers.arrayElement(["credit", "debit"]),
          adminAuthorizedId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return payments;
    };

    const paymentsData = await generatePayments();
    await queryInterface.bulkInsert("Payments", paymentsData, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Payments", null, {});
  },
};
