"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductHistory.init(
    {
      id: DataTypes.UUID,
      productId: DataTypes.UUID,
      supplierId: DataTypes.UUID,
      action: DataTypes.STRING,
      previousPrice: DataTypes.DECIMAL,
      newPrice: DataTypes.DECIMAL,
      date: DataTypes.DATE,
      adminId: DataTypes.UUID,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ProductHistory",
    }
  );
  return ProductHistory;
};
