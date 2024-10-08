"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: DataTypes.UUID,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      dni: DataTypes.STRING,
      imageId: DataTypes.UUID,
      password: DataTypes.STRING,
      enabled: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      paymentType: DataTypes.STRING,
      lastPaymentDate: DataTypes.DATE,
      quotationCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
