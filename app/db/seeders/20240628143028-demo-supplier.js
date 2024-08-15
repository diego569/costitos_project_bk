"use strict";
const { hashPassword } = require("../../../utils/handlePassword");
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const images = await queryInterface.sequelize.query(
      'SELECT id FROM "Images";'
    );
    const imageRows = images[0];

    const generatePhoneNumber = () => {
      const min = 900000000;
      const max = 999999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber.toString();
    };

    // Insertar un proveedor específico
    await queryInterface.bulkInsert("Suppliers", [
      {
        id: uuidv4(),
        name: "Quisvar Supplier",
        legalRepresentative: "Quisvar Representative",
        businessName: "Quisvar Business",
        economicActivity: "Technology Services",
        fiscalAddress: "Quisvar Street 123",
        ruc: fakerES.number.int({ min: 100000000, max: 999999999 }).toString(),
        imageId: imageRows[0].id, // Usando la primera imagen para este proveedor
        email: "quisvar@quisvar",
        phone: generatePhoneNumber(),
        role: "supplier",
        password: await hashPassword("quisvar"),
        enabled: true,
        adminAuthorizedId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateSuppliers = async () => {
      const suppliers = [];
      for (let i = 0; i < 20; i++) {
        const randomImageId =
          imageRows[Math.floor(Math.random() * imageRows.length)].id;

        suppliers.push({
          id: uuidv4(),
          name: fakerES.company.name(),
          legalRepresentative: fakerES.person.firstName(),
          businessName: fakerES.company.name(),
          economicActivity: fakerES.company.catchPhrase(),
          fiscalAddress: fakerES.location.street(),
          ruc: fakerES.number
            .int({ min: 100000000, max: 999999999 })
            .toString(),
          imageId: randomImageId,
          email: fakerES.internet.email(),
          phone: generatePhoneNumber(), // Generate random phone number
          role: "supplier",
          password: await hashPassword(fakerES.internet.password()),
          enabled: true,
          adminAuthorizedId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return suppliers;
    };

    const suppliersData = await generateSuppliers();
    await queryInterface.bulkInsert("Suppliers", suppliersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Suppliers", null, {});
  },
};
