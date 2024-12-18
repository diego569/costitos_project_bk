const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Product = require("./product");
const Supplier = require("./supplier");
const User = require("./user");

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
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    newPrice: {
      type: DataTypes.DECIMAL,
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
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
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
