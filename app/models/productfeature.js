const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Product = require("./product");
const Feature = require("./feature");

const ProductFeature = sequelize.define(
  "ProductFeature",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    featureId: {
      type: DataTypes.UUID,
      references: {
        model: Feature,
        key: "id",
      },
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
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
    tableName: "ProductFeatures",
  }
);

ProductFeature.belongsTo(Product, { foreignKey: "productId", as: "product" });
ProductFeature.belongsTo(Feature, { foreignKey: "featureId", as: "feature" });

module.exports = ProductFeature;
