"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener usuarios y proveedores existentes
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );

    const userRows = users[0];
    const supplierRows = suppliers[0];

    // Validación de datos
    if (userRows.length === 0 || supplierRows.length === 0) {
      throw new Error(
        "No se encontraron usuarios o proveedores en la base de datos."
      );
    }

    // Crear datos específicos
    const fixedUserSupplierHistories = [
      {
        id: uuidv4(),
        userId: userRows[0].id,
        supplierId: supplierRows[0].id,
        action: "contact update",
        date: new Date("2024-01-10"),
        adminId: userRows[1]?.id || null,
        description: "Updated contact information for supplier 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: userRows[1].id,
        supplierId: supplierRows[1].id,
        action: "profile review",
        date: new Date("2024-02-15"),
        adminId: userRows[2]?.id || null,
        description: "Reviewed supplier profile",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Generar datos dinámicos
    const generateUserSupplierHistories = () => {
      const userSupplierHistories = [];

      for (let i = 0; i < 50; i++) {
        const randomUserId =
          userRows[Math.floor(Math.random() * userRows.length)].id;
        const randomSupplierId =
          supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
        const randomAdminId =
          userRows[Math.floor(Math.random() * userRows.length)].id;

        userSupplierHistories.push({
          id: uuidv4(),
          userId: randomUserId,
          supplierId: randomSupplierId,
          action: faker.helpers.arrayElement([
            "contact update",
            "profile review",
            "supply contract",
          ]),
          date: faker.date.between({
            from: Date("2023-01-01"),
            to: Date("2024-12-31"),
          }),
          adminId: randomAdminId,
          description: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return userSupplierHistories;
    };

    const dynamicUserSupplierHistories = generateUserSupplierHistories();

    // Insertar datos en la tabla
    await queryInterface.bulkInsert(
      "UserSupplierHistories",
      [...fixedUserSupplierHistories, ...dynamicUserSupplierHistories],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserSupplierHistories", null, {});
  },
};
