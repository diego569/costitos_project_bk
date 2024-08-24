const Category = require("../../models/category");
const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const Quotation = require("../../models/quotation");
const User = require("../../models/user");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const getQuotationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Consulta utilizando el ORM de Sequelize
    const quotations = await Quotation.findAll({
      where: { userId },
      attributes: [
        "id",
        "name",
        "type",
        "price",
        "status",
        "quotationCount",
        "quotationNumber",
        [
          sequelize.fn(
            "to_char",
            sequelize.col("createdAt"),
            "DD Mon YYYY HH24:MI:SS"
          ),
          "date",
        ], // Formato de fecha
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación en orden descendente
    });

    const response = {
      count: quotations.length,
      data: quotations,
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
      name: result.length > 0 ? result[0].quotationName : "", // Extract quotation name
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

const updateQuotationName = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { name } = req.body;

    const updatedQuotation = await Quotation.update(
      { name },
      { where: { id: quotationId } }
    );

    if (updatedQuotation[0] === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.json({ message: "Quotation name updated successfully" });
  } catch (error) {
    console.error("Error updating quotation name:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getQuotationsByUser,
  getQuotationDetails,
  getQuotationCountById,
  updateQuotationName,
};
