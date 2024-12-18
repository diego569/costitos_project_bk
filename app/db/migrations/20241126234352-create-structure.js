"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Structures", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      projectName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      goals: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      unifiedCode: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      modularCode: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      designer: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      executionTime: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
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
    await queryInterface.dropTable("Structures");
  },
};
