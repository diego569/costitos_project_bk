const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Subcategory = require("./subcategory");
const Supplier = require("./supplier");
const Image = require("./image");
const User = require("./user");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageId: {
      type: DataTypes.UUID,
      references: {
        model: Image,
        key: "id",
      },
      allowNull: true,
    },
    subcategoryId: {
      type: DataTypes.UUID,
      references: {
        model: Subcategory,
        key: "id",
      },
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.UUID,
      references: {
        model: Supplier,
        key: "id",
      },
      allowNull: true,
    },
    adminAuthorizedId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    authorizationDate: {
      type: DataTypes.DATE,
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
    tableName: "Products",
  }
);

Product.belongsTo(Image, { foreignKey: "imageId", as: "image" });

Product.belongsTo(Subcategory, {
  foreignKey: "subcategoryId",
  as: "subcategory",
});

Product.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });

Product.belongsTo(User, {
  foreignKey: "adminAuthorizedId",
  as: "adminAuthorized",
});

module.exports = Product;
