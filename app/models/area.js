const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Structure = require("./structure");
const Quotation = require("./quotation");

const Area = sequelize.define(
  "Area",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    structureId: {
      type: DataTypes.UUID,
      references: {
        model: Structure,
        key: "id",
      },
      allowNull: false,
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
    tableName: "Areas",
  }
);

module.exports = Area;
