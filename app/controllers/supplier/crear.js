const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const Subcategory = require("../../models/subcategory");
const sequelize = new Sequelize(config.development);
require("dotenv").config();
const slugify = require("slugify");

const PUBLIC_URL = process.env.PUBLIC_URL;
const { v4: uuidv4 } = require("uuid");

const createItem = async (req, res) => {
  try {
    const { file } = req;
    const id = uuidv4();
    const fileData = {
      id,
      filename: file.filename,
      url: `${PUBLIC_URL}/${file.filename}`,
    };

    const [result] = await sequelize.query(
      `
      INSERT INTO "Images" (id, filename, url, "createdAt", "updatedAt")
      VALUES (:id, :filename, :url, NOW(), NOW())
      RETURNING id;
      `,
      {
        replacements: fileData,
        type: sequelize.QueryTypes.INSERT,
      }
    );

    const createdId = result[0].id;

    res.status(201).send({ id: createdId });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      id = uuidv4(),
      name,
      description,
      imageId,
      subcategoryId,
      supplierId,
      status = "active",
      createdAt = new Date(),
      updatedAt = new Date(),
    } = req.body;

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    const productData = {
      id,
      name,
      slug,
      description,
      imageId,
      subcategoryId,
      supplierId,
      status,
      createdAt,
      updatedAt,
    };

    const [result] = await sequelize.query(
      `
        INSERT INTO "Products" (id, name, slug, description, "imageId", "subcategoryId", "supplierId", status, "createdAt", "updatedAt")
        VALUES (:id, :name, :slug, :description, :imageId, :subcategoryId, :supplierId, :status, :createdAt, :updatedAt)
        RETURNING id;
        `,
      {
        replacements: productData,
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).send({ id: result[0].id });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

const createSupplierProduct = async (req, res) => {
  try {
    const { supplierId, productName, productId, price, unitOfMeasure } =
      req.body;

    const slug = slugify(`${productName}-${unitOfMeasure}-${supplierId}`, {
      lower: true,
      strict: true,
    });

    const supplierProductData = {
      id: uuidv4(),
      supplierId,
      productId,
      slug,
      price,
      unitOfMeasure,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [result] = await sequelize.query(
      `
        INSERT INTO "SupplierProducts" (id, "supplierId", "productId", slug, price, "unitOfMeasure", status, "createdAt", "updatedAt")
        VALUES (:id, :supplierId, :productId, :slug, :price, :unitOfMeasure, :status, :createdAt, :updatedAt)
        RETURNING id;
        `,
      {
        replacements: supplierProductData,
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).send({ id: result[0].id });
  } catch (e) {
    console.error("Error al crear el SupplierProduct:", e);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createItem,
  createProduct,
  createSupplierProduct,
};
