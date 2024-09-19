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

    const slug = slugify(name, { lower: true, strict: true });

    const existingProduct = await sequelize.query(
      `
      SELECT id FROM "Products" WHERE slug = :slug
      `,
      {
        replacements: { slug },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingProduct.length > 0) {
      return res
        .status(400)
        .send({ error: "Nombre repetido. El slug ya existe." });
    }

    const safeSubcategoryId = subcategoryId ? subcategoryId : null;
    const safeImageId = imageId ? imageId : null;

    const generateRandomCode = () => {
      const letters = Array(3)
        .fill(null)
        .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
        .join("");
      const numbers = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
      return `${letters}${numbers}`;
    };

    const code = generateRandomCode();

    const productData = {
      id,
      name,
      slug,
      description,
      imageId: safeImageId,
      subcategoryId: safeSubcategoryId,
      supplierId,
      status,
      createdAt,
      updatedAt,
      code,
    };

    const [result] = await sequelize.query(
      `
        INSERT INTO "Products" (id, name, slug, description, "imageId", "subcategoryId", "supplierId", status, "createdAt", "updatedAt", code)
        VALUES (:id, :name, :slug, :description, :imageId, :subcategoryId, :supplierId, :status, :createdAt, :updatedAt, :code)
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
    const { supplierId, productName, productId, price, unitOfMeasureId } =
      req.body;

    const unitOfMeasure = await sequelize.query(
      `
        SELECT value FROM "UnitOfMeasure" WHERE id = :unitOfMeasureId
      `,
      {
        replacements: { unitOfMeasureId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!unitOfMeasure || unitOfMeasure.length === 0) {
      return res.status(400).send({ error: "Unidad de medida no encontrada." });
    }

    // Use the value for slug generation
    const slug = slugify(
      `${productName}-${unitOfMeasure[0].value}-${supplierId}`,
      {
        lower: true,
        strict: true,
      }
    );

    const supplierProductData = {
      id: uuidv4(),
      supplierId,
      productId,
      slug,
      price,
      unitOfMeasureId, // Use the foreign key reference
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [result] = await sequelize.query(
      `
        INSERT INTO "SupplierProducts" (id, "supplierId", "productId", slug, price, "unitOfMeasureId", status, "createdAt", "updatedAt")
        VALUES (:id, :supplierId, :productId, :slug, :price, :unitOfMeasureId, :status, :createdAt, :updatedAt)
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
