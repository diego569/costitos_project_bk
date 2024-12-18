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
      id: DataTypes.UUID,
      name: DataTypes.STRING,
      ruc: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      enabled: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      adminAuthorizedId: DataTypes.UUID,
      imageId: DataTypes.UUID,
      contributorType: DataTypes.STRING,
      documentType: DataTypes.STRING,
      commercialName: DataTypes.STRING,
      registrationDate: DataTypes.DATE,
      activityStartDate: DataTypes.DATE,
      contributorStatus: DataTypes.STRING,
      contributorCondition: DataTypes.STRING,
      fiscalAddress: DataTypes.STRING,
      invoiceEmissionSystem: DataTypes.STRING,
      foreignTradeActivity: DataTypes.STRING,
      accountingSystem: DataTypes.STRING,
      mainEconomicActivity: DataTypes.STRING,
      secondaryEconomicActivity1: DataTypes.STRING,
      authorizedPaymentReceipts: DataTypes.STRING,
      electronicEmissionSystem: DataTypes.STRING,
      electronicIssuerSince: DataTypes.DATE,
      electronicReceipts: DataTypes.STRING,
      affiliatedToPLE: DataTypes.BOOLEAN,
      registries: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
