const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const QuotationProduct = require("./QuotationProduct");
const Supplier = require("./Supplier");

const QuotationSupplierProduct = sequelize.define(
  "QuotationSupplierProduct",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    quotationProductId: {
      type: DataTypes.UUID,
      references: {
        model: QuotationProduct,
        key: "id",
      },
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.UUID,
      references: {
        model: Supplier,
        key: "id",
      },
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "QuotationSupplierProducts",
  }
);

QuotationSupplierProduct.belongsTo(QuotationProduct, {
  foreignKey: "quotationProductId",
  as: "quotationProduct",
});
QuotationSupplierProduct.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

module.exports = QuotationSupplierProduct;
