"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductFeature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductFeature.init(
    {
      id: DataTypes.UUID,
      productId: DataTypes.UUID,
      featureId: DataTypes.UUID,
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductFeature",
    }
  );
  return ProductFeature;
};
