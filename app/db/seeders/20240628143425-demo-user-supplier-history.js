"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );

    const userRows = users[0];
    const supplierRows = suppliers[0];

    await queryInterface.bulkInsert("UserSupplierHistories", [
      {
        id: uuidv4(),
        userId: userRows[0].id,
        supplierId: supplierRows[0].id,
        action: "contact update",
        date: new Date(),
        adminId: userRows[1].id,
        description: "Updated contact information",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId: userRows[1].id,
        supplierId: supplierRows[1].id,
        action: "profile review",
        date: new Date(),
        adminId: userRows[2].id,
        description: "Reviewed supplier profile",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const generateUserSupplierHistories = async () => {
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
          action: fakerES.helpers.arrayElement([
            "contact update",
            "profile review",
          ]),
          date: new Date(),
          adminId: randomAdminId,
          description: fakerES.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return userSupplierHistories;
    };

    const userSupplierHistoriesData = await generateUserSupplierHistories();
    await queryInterface.bulkInsert(
      "UserSupplierHistories",
      userSupplierHistoriesData,
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserSupplierHistories", null, {});
  },
};
