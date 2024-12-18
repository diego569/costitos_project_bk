const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const User = require("./user");
const Image = require("./image");

const Supplier = sequelize.define(
  "Supplier",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ruc: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminAuthorizedId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
    imageId: {
      type: DataTypes.UUID,
      references: {
        model: Image,
        key: "id",
      },
      allowNull: true,
    },
    contributorType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commercialName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    activityStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contributorStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contributorCondition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fiscalAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invoiceEmissionSystem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foreignTradeActivity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountingSystem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mainEconomicActivity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryEconomicActivity1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authorizedPaymentReceipts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    electronicEmissionSystem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    electronicIssuerSince: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    electronicReceipts: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    affiliatedToPLE: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    registries: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "Suppliers",
  }
);

Supplier.belongsTo(Image, { foreignKey: "imageId", as: "image" });
Supplier.belongsTo(User, {
  foreignKey: "adminAuthorizedId",
  as: "adminAuthorized",
});

module.exports = Supplier;
