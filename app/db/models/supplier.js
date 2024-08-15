"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      legalRepresentative: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      economicActivity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fiscalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ruc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      imageId: DataTypes.UUID,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      cellphone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: DataTypes.STRING,

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      adminAuthorizedId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
