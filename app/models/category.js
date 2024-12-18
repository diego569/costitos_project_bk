const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/config");
const sequelize = new Sequelize(config.development);
const Subcategory = require("./subcategory");

const Category = sequelize.define(
  "Category",
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
    photo: {
      type: DataTypes.STRING,
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
    tableName: "Categories",
  }
);

Category.hasMany(Subcategory, {
  foreignKey: "categoryId",
  as: "subcategories",
});

module.exports = Category;
