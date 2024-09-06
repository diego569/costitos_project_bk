const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Supplier = require("./supplier");
const Product = require("./product");
const User = require("./user");

const SupplierProduct = sequelize.define(
  "SupplierProduct",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    productId: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: "id",
      },
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
    unitOfMeasure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminAuthorizedId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
    status: {
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
    tableName: "SupplierProducts",
  }
);

SupplierProduct.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});
SupplierProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });
SupplierProduct.belongsTo(User, {
  foreignKey: "adminAuthorizedId",
  as: "adminAuthorized",
});

module.exports = SupplierProduct;
