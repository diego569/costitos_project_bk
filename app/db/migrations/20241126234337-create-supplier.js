"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Suppliers", {
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
      ruc: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      enabled: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      documentType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      adminAuthorizedId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      imageId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "Images",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      contributorType: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      commercialName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      registrationDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      activityStartDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      contributorStatus: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      contributorCondition: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      fiscalAddress: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      invoiceEmissionSystem: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      foreignTradeActivity: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      accountingSystem: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mainEconomicActivity: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      secondaryEconomicActivity1: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      authorizedPaymentReceipts: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      electronicEmissionSystem: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      electronicIssuerSince: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      electronicReceipts: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      affiliatedToPLE: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      registries: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Suppliers");
  },
};
