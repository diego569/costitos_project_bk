"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSupplierHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSupplierHistory.init(
    {
      id: DataTypes.UUID,
      entityType: DataTypes.STRING,
      entityId: DataTypes.UUID,
      action: DataTypes.STRING,
      date: DataTypes.DATE,
      adminId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "UserSupplierHistory",
    }
  );
  return UserSupplierHistory;
};
