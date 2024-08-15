const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Product = require("./Product");
const Supplier = require("./Supplier");
const User = require("./User");

const ProductHistory = sequelize.define(
  "ProductHistory",
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
    supplierId: {
      type: DataTypes.UUID,
      references: {
        model: Supplier,
        key: "id",
      },
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previousPrice: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    newPrice: {
      type: DataTypes.NUMERIC,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "ProductHistories",
  }
);

ProductHistory.belongsTo(Product, { foreignKey: "productId", as: "product" });
ProductHistory.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});
ProductHistory.belongsTo(User, { foreignKey: "adminId", as: "admin" });

module.exports = ProductHistory;
