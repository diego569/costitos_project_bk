"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Areas", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: true, // Ahora opcional
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true, // Ya era opcional
        type: Sequelize.TEXT,
      },
      type: {
        allowNull: false, // Ahora opcional
        type: Sequelize.STRING,
      },
      structureId: {
        allowNull: false, // Este sigue siendo obligatorio
        type: Sequelize.UUID,
        references: {
          model: "Structures",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Areas");
  },
};
