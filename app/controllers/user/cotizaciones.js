const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const { Quotation } = require("../../models/quotation");
const User = require("../../models/user");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const getQuotationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await sequelize.query(
      `
        SELECT
          q.id,
          q.name,
          q.type,
          q.price,
          q.status,
          q."quotationCount",
          q."quotationNumber",
          q."createdAt",
          q."updatedAt"
        FROM
          public."Quotations" q
        WHERE
          q."userId" = '${userId}'
        `,
      { type: sequelize.QueryTypes.SELECT }
    );

    const response = {
      count: result.length,
      data: result,
    };

    res.json(response);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getQuotationDetails = async (req, res) => {
  try {
    const { quotationId } = req.params;

    const result = await sequelize.query(
      `
        SELECT
          q.id,
          q.name AS "quotationName",
          q.type,
          q.price AS "quotationPrice",
          q.status AS "quotationStatus",
          q."quotationCount" AS "quotationCount",
          qp."productId",
          p.name AS "productName",
          p.description AS "productDescription",
          i.url AS "productPhoto",
          sp."unitOfMeasure" AS "productUnitOfMeasure",
          qp.quantity AS "productQuantity",
          qsp."supplierId",
          s.name AS "supplierName",
          s.email AS "supplierEmail",
          s.ruc AS "supplierRuc",
          s."fiscalAddress" AS "supplierAddress",
          s.cellphone AS "supplierPhone",
          qsp."unitPrice" AS "supplierUnitPrice"
        FROM
          public."Quotations" q
        JOIN
          public."QuotationProducts" qp ON q.id = qp."quotationId"
        JOIN
          public."Products" p ON qp."productId" = p.id
        JOIN
          public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
        JOIN
          public."Suppliers" s ON qsp."supplierId" = s.id
        JOIN
          public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        WHERE
          q.id = :quotationId
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { quotationId },
      }
    );

    const response = {
      count: result.length,
      data: result,
    };

    res.json(response);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getQuotationCountById = async (req, res) => {
  const userId = req.params.id; // Obtener el ID del usuario de los parámetros de la ruta

  try {
    // Buscar el usuario por su ID
    const user = await User.findByPk(userId, {
      attributes: ["quotationCount"], // Solo seleccionar el campo quotationCount
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ quotationCount: user.quotationCount });
  } catch (error) {
    console.error("Error al obtener quotationCount por ID:", error);
    res.status(500).json({ error: "Error al obtener quotationCount por ID" });
  }
};
module.exports = {
  getQuotationsByUser,
  getQuotationDetails,
  getQuotationCountById,
};
