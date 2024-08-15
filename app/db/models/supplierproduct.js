"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SupplierProduct extends Model {
    static associate(models) {
      // define association here
      SupplierProduct.belongsTo(models.Supplier, { foreignKey: "supplierId" });
      SupplierProduct.belongsTo(models.Product, { foreignKey: "productId" });
      SupplierProduct.belongsTo(models.User, {
        as: "AdminAuthorized",
        foreignKey: "adminAuthorizedId",
      });
    }
  }

  SupplierProduct.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      supplierId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Suppliers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      unitOfMeasure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adminAuthorizedId: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      sequelize,
      modelName: "SupplierProduct",
      tableName: "SupplierProducts",
      timestamps: true,
    }
  );

  return SupplierProduct;
};
