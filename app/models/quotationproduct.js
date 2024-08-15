const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Quotation = require("./Quotation");
const Product = require("./Product");

const QuotationProduct = sequelize.define(
  "QuotationProduct",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    quotationId: {
      type: DataTypes.UUID,
      references: {
        model: Quotation,
        key: "id",
      },
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: "id",
      },
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
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
    tableName: "QuotationProducts",
  }
);

QuotationProduct.belongsTo(Quotation, {
  foreignKey: "quotationId",
  as: "quotation",
});
QuotationProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = QuotationProduct;
