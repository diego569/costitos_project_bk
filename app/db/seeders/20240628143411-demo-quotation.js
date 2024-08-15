"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );

    const userRows = users[0];

    await queryInterface.bulkInsert("Quotations", [
      {
        id: uuidv4(),
        userId: userRows[0].id,
        name: "Quotation 1",
        type: "type1",
        price: 1000,
        status: "pending",
        quotationCount: 1,
        quotationNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: userRows[1].id,
        name: "Quotation 2",
        type: "type2",
        price: 2000,
        status: "completed",
        quotationCount: 2,
        quotationNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateQuotations = async () => {
      const quotations = [];
      for (let i = 3; i < 100; i++) {
        const randomUserId =
          userRows[Math.floor(Math.random() * userRows.length)].id;
        quotations.push({
          id: uuidv4(),
          userId: randomUserId,
          name: fakerES.commerce.productName(),
          type: fakerES.helpers.arrayElement(["type1", "type2"]),
          price: fakerES.number.float({
            min: 100,
            max: 10000,
            precision: 0.01,
          }),
          status: fakerES.helpers.arrayElement([
            "pending",
            "completed",
            "cancelled",
          ]),
          quotationCount: fakerES.number.int({ min: 1, max: 10 }),
          quotationNumber: i,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return quotations;
    };

    const quotationsData = await generateQuotations();
    await queryInterface.bulkInsert("Quotations", quotationsData, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Quotations", null, {});
  },
};
