"use strict";

const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../../../utils/handlePassword");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const images = await queryInterface.sequelize.query(
      'SELECT id FROM "Images";'
    );
    const imageRows = images[0];

    const generatePhoneNumber = () => {
      return `9${Math.floor(10000000 + Math.random() * 90000000)}`;
    };

    const users = [
      {
        id: uuidv4(),
        firstName: "Normal",
        lastName: "User",
        email: "normal@user.com",
        dni: "98765432",
        password: await hashPassword("normal"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "normal",
        paymentType: "cotizacion",
        lastPaymentDate: new Date("2024-06-10"),
        quotationCount: 10000,
        imageId: imageRows[2]?.id || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: "Arnaldo",
        lastName: "Medina",
        email: "arnaldo@medina.com",
        dni: "74154730",
        password: await hashPassword("medina"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "superadmin",
        paymentType: "mensual",
        lastPaymentDate: new Date("2024-06-10"),
        quotationCount: 10,
        imageId: imageRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (let i = 0; i < 19; i++) {
      const randomImageId =
        imageRows[Math.floor(Math.random() * imageRows.length)].id;
      users.push({
        id: uuidv4(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        dni: faker.string.numeric(8),
        password: await hashPassword("defaultPassword"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: faker.helpers.arrayElement(["normal", "admin"]),
        paymentType: faker.helpers.arrayElement(["mensual", "cotizacion"]),
        lastPaymentDate: new Date(),
        quotationCount: faker.number.int({ min: 0, max: 50 }),
        imageId: randomImageId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
