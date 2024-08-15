"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QuotationSupplierProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuotationSupplierProduct.init(
    {
      id: DataTypes.UUID,
      quotationProductId: DataTypes.UUID,
      supplierId: DataTypes.UUID,
      unitPrice: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "QuotationSupplierProduct",
    }
  );
  return QuotationSupplierProduct;
};
