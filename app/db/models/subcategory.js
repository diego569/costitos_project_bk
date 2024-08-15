"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subcategory.init(
    {
      id: DataTypes.UUID,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      photo: DataTypes.STRING,
      categoryId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Subcategory",
    }
  );
  return Subcategory;
};
