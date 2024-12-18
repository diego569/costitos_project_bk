"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener usuarios y áreas existentes
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );
    const areas = await queryInterface.sequelize.query(
      'SELECT id FROM "Areas";'
    );

    const userRows = users[0];
    const areaRows = areas[0];

    // Validación de datos
    if (userRows.length === 0 || areaRows.length === 0) {
      throw new Error(
        "No se encontraron usuarios o áreas en la base de datos. Asegúrate de que las tablas Users y Areas contengan datos."
      );
    }

    // Citar ejemplos específicos
    const fixedQuotations = [
      {
        id: uuidv4(),
        userId: userRows[0].id,
        areaId: areaRows[0].id,
        name: "Quotation for Primary School",
        type: "Construction",
        price: 5000.0,
        status: "pending",
        quotationCount: 1,
        quotationNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: userRows[1].id,
        areaId: areaRows[1].id,
        name: "Quotation for Sanitation",
        type: "Sanitation",
        price: 10000.0,
        status: "completed",
        quotationCount: 2,
        quotationNumber: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Generar cotizaciones adicionales dinámicamente
    const generateQuotations = () => {
      const quotations = [];
      for (let i = 3; i <= 50; i++) {
        const randomUserId =
          userRows[Math.floor(Math.random() * userRows.length)].id;
        const randomAreaId =
          areaRows[Math.floor(Math.random() * areaRows.length)].id;

        quotations.push({
          id: uuidv4(),
          userId: randomUserId,
          areaId: randomAreaId,
          name: faker.commerce.productName(),
          type: faker.helpers.arrayElement([
            "Construction",
            "Sanitation",
            "Electrification",
            "Urbanization",
          ]),
          price: faker.number.float({
            min: 1000,
            max: 50000,
            multipleOf: 0.01,
          }),
          status: faker.helpers.arrayElement([
            "pending",
            "completed",
            "cancelled",
          ]),
          quotationCount: faker.number.int({ min: 1, max: 10 }),
          quotationNumber: i,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return quotations;
    };

    const dynamicQuotations = generateQuotations();

    // Insertar todas las cotizaciones
    await queryInterface.bulkInsert(
      "Quotations",
      [...fixedQuotations, ...dynamicQuotations],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Quotations", null, {});
  },
};
