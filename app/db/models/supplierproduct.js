'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SupplierProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SupplierProduct.init({
    id: DataTypes.UUID,
    supplierId: DataTypes.UUID,
    productId: DataTypes.UUID,
    slug: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    adminAuthorizedId: DataTypes.UUID,
    unitOfMeasureId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'SupplierProduct',
  });
  return SupplierProduct;
};