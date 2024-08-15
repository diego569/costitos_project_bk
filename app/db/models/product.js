"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      id: DataTypes.UUID,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.TEXT,
      imageId: DataTypes.UUID,
      subcategoryId: DataTypes.UUID,
      status: DataTypes.STRING,
      supplierId: DataTypes.UUID,
      adminAuthorizedId: DataTypes.UUID,
      creationDate: DataTypes.DATE,
      authorizationDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
