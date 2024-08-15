"use strict";
const { hashPassword } = require("../../../utils/handlePassword");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const images = await queryInterface.sequelize.query(
      'SELECT id FROM "Images";'
    );
    const imageRows = images[0];

    // Helper function to generate a random 9-digit phone number starting with '9'
    const generatePhoneNumber = () => {
      const min = 900000000; // Minimum 9-digit number starting with '9'
      const max = 999999999; // Maximum 9-digit number
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber.toString();
    };

    // Insert specific users
    await queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        firstName: "Arnaldo",
        lastName: "Medina",
        email: "arnaldo@medina.com",
        dni: "74154730",
        imageId: imageRows[0].id,
        password: await hashPassword("medina"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "superadmin",
        paymentType: "mensual",
        lastPaymentDate: new Date("2024-06-10"),
        quotationCount: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: "Admin",
        lastName: "User",
        email: "admin@user.com",
        dni: "12345678",
        imageId: imageRows[1].id,
        password: await hashPassword("admin"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "admin",
        paymentType: "mensual",
        lastPaymentDate: new Date("2024-06-10"),
        quotationCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: "Normal",
        lastName: "User",
        email: "normal@user.com",
        dni: "98765432",
        imageId: imageRows[2].id,
        password: await hashPassword("normal"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "normal",
        paymentType: "cotizacion",
        lastPaymentDate: new Date("2024-06-10"),
        quotationCount: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateUsers = async () => {
      const users = [];
      const randomImageId =
        imageRows[Math.floor(Math.random() * imageRows.length)].id;

      for (let i = 3; i < 50; i++) {
        users.push({
          id: uuidv4(),
          firstName: fakerES.person.firstName(),
          lastName: fakerES.person.lastName(),
          email: fakerES.internet.email(),
          dni: fakerES.number.int({ min: 10000000, max: 99999999 }).toString(),
          imageId: randomImageId,
          password: fakerES.person.firstName(),
          phone: generatePhoneNumber(), // Generate random phone number
          enabled: true,
          role: fakerES.helpers.arrayElement(["normal", "admin"]),
          paymentType: fakerES.helpers.arrayElement(["mensual", "cotizacion"]),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return users;
    };

    const usersData = await generateUsers();
    await queryInterface.bulkInsert("Users", usersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
