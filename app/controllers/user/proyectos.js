const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const Structure = require("../../models/structure");
const Area = require("../../models/area");
const Quotation = require("../../models/quotation");
const Supplier = require("../../models/supplier");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

// Obtener proyectos de usuario
const getProjectsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Structure.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

// Obtener áreas de un proyecto
const getAreasByProject = async (req, res) => {
  const { structureId } = req.params;
  try {
    const areas = await Area.findAll({
      where: { structureId },
      attributes: [
        "id",
        "name",
        "type",
        "description",
        "createdAt",
        "updatedAt",
      ], // Cambiado 'name' por 'type'
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ success: true, data: areas });
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

const createArea = async (req, res) => {
  try {
    const { id: structureId } = req.params; // ID del proyecto
    const { type } = req.body; // Datos enviados desde el frontend

    // Validar que se proporcione el campo requerido
    if (!type || !structureId) {
      return res.status(400).json({
        success: false,
        message: "El tipo del área y el ID del proyecto son obligatorios.",
      });
    }

    // Crear la nueva área
    const newArea = await Area.create({
      type,
      structureId,
    });

    res.status(201).json({
      success: true,
      data: newArea,
      message: "Área agregada exitosamente.",
    });
  } catch (error) {
    console.error("Error al agregar el área:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

// // Crear proyecto
// const createProject = async (req, res) => {
//   const { name, unifiedCode, description, userId } = req.body;
//   try {
//     const newProject = await Structure.create({
//       name,
//       unifiedCode,
//       description,
//       userId,
//     });
//     res.status(201).json({ success: true, data: newProject });
//   } catch (error) {
//     console.error("Error al crear el proyecto:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error interno del servidor." });
//   }
// };

const createProject = async (req, res) => {
  const { name, unifiedCode, description, userId } = req.body;
  try {
    // Crear el nuevo proyecto
    const newProject = await Structure.create({
      name,
      unifiedCode,
      description,
      userId,
    });

    // Crear un área llamada "Sin asignar" asociada al nuevo proyecto
    const defaultArea = await Area.create({
      type: "Sin asignar",
      structureId: newProject.id,
    });

    res.status(201).json({
      success: true,
      data: {
        project: newProject,
        defaultArea,
      },
      message: "Proyecto y área por defecto creados exitosamente.",
    });
  } catch (error) {
    console.error("Error al crear el proyecto y el área por defecto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

const updateProject = async (req, res) => {
  const { structureId } = req.params;
  const { name, unifiedCode, description } = req.body;
  try {
    const project = await Structure.findByPk(structureId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Proyecto no encontrado." });
    }
    project.name = name || project.name;
    project.unifiedCode = unifiedCode || project.unifiedCode;
    project.description = description || project.description;
    await project.save();
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

const deleteProject = async (req, res) => {
  const { structureId } = req.params;
  try {
    const project = await Structure.findByPk(structureId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Proyecto no encontrado." });
    }
    await project.destroy();
    res
      .status(200)
      .json({ success: true, message: "Proyecto eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

const getQuotationsByArea = async (req, res) => {
  const { areaId } = req.params;
  try {
    const quotations = await Quotation.findAll({
      where: { areaId },
      attributes: [
        "id",
        "name",
        "type",
        "price",
        "status",
        "quotationCount",
        "quotationNumber",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ success: true, data: quotations });
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

const searchProjects = async (req, res) => {
  const { query } = req.query;
  const { userId } = req.params;

  try {
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "La consulta de búsqueda es obligatoria.",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "El ID del usuario es obligatorio.",
      });
    }

    const projects = await Structure.findAll({
      where: {
        userId,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { unifiedCode: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error al buscar proyectos:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};
const getProjectByQuotationId = async (req, res) => {
  const { quotationId } = req.params;
  try {
    const quotation = await Quotation.findByPk(quotationId, {
      include: {
        model: Structure,
        attributes: ["id", "name", "unifiedCode"],
      },
    });

    if (!quotation || !quotation.Structure) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado para esta cotización.",
      });
    }

    res.status(200).json({
      success: true,
      data: quotation.Structure,
    });
  } catch (error) {
    console.error("Error al obtener proyecto asociado:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};

const updateQuotationProject = async (req, res) => {
  const { quotationId } = req.params;
  const { projectId } = req.body;

  try {
    const [quotation] = await sequelize.query(
      `
      SELECT q.id, a."structureId" AS "currentProjectId"
      FROM public."Quotations" q
      JOIN public."Areas" a ON q."areaId" = a.id
      WHERE q.id = :quotationId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { quotationId },
      }
    );

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Cotización no encontrada." });
    }

    // Verificar si el nuevo proyecto existe
    const [project] = await sequelize.query(
      `
      SELECT id
      FROM public."Structures"
      WHERE id = :projectId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { projectId },
      }
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Proyecto no encontrado." });
    }

    const [newArea] = await sequelize.query(
      `
      SELECT id
      FROM public."Areas"
      WHERE "structureId" = :projectId
      LIMIT 1
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { projectId },
      }
    );

    if (!newArea) {
      return res.status(400).json({
        success: false,
        message: "El proyecto seleccionado no tiene áreas disponibles.",
      });
    }

    // Actualizar el área de la cotización
    await sequelize.query(
      `
      UPDATE public."Quotations"
      SET "areaId" = :newAreaId
      WHERE id = :quotationId
      `,
      {
        replacements: { newAreaId: newArea.id, quotationId },
      }
    );

    return res.status(200).json({
      success: true,
      message: "El proyecto de la cotización se ha actualizado con éxito.",
    });
  } catch (error) {
    console.error("Error al actualizar el proyecto de la cotización:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

const updateQuotationArea = async (req, res) => {
  const { quotationId } = req.params;
  const { areaId } = req.body;

  try {
    // Verificar si la cotización existe
    const [quotation] = await sequelize.query(
      `
      SELECT q.id, q."areaId"
      FROM public."Quotations" q
      WHERE q.id = :quotationId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { quotationId },
      }
    );

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Cotización no encontrada." });
    }

    // Actualizar directamente el área de la cotización
    await sequelize.query(
      `
      UPDATE public."Quotations"
      SET "areaId" = :areaId
      WHERE id = :quotationId
      `,
      {
        replacements: { areaId, quotationId },
      }
    );

    return res.status(200).json({
      success: true,
      message: "El área de la cotización se ha actualizado con éxito.",
    });
  } catch (error) {
    console.error("Error al actualizar el área de la cotización:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

const getQuotationsWithDetailsByArea = async (req, res) => {
  const { areaId } = req.params;

  try {
    // Verificar que el área tiene cotizaciones
    const quotations = await Quotation.findAll({
      where: { areaId },
      attributes: [
        "id",
        "name",
        "type",
        "price",
        "status",
        "quotationCount",
        "quotationNumber",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    if (!quotations || quotations.length === 0) {
      return res
        .status(404)
        .json({ error: "No quotations found for the given area" });
    }

    // Obtener los IDs de las cotizaciones
    const quotationIds = quotations.map((q) => q.id);

    // Obtener los detalles de todas las cotizaciones con una sola consulta
    const result = await sequelize.query(
      `
        SELECT
          q.id AS "quotationId",
          q.name AS "quotationName",
          q.type AS "quotationType",
          q.price AS "quotationPrice",
          q.status AS "quotationStatus",
          q."quotationCount" AS "quotationCount",
          qp."productId",
          p.name AS "productName",
          p.description AS "productDescription",
          i.url AS "productPhoto",
          uom.value AS "productUnitOfMeasure",
          qp.quantity AS "productQuantity",
          qsp."supplierId",
          s.name AS "supplierName",
          s.email AS "supplierEmail",
          s.ruc AS "supplierRuc",
          s."fiscalAddress" AS "supplierAddress",
          s."phone" AS "supplierPhone",
          qsp."unitPrice" AS "supplierUnitPrice",
          q."createdAt",
          to_char(q."createdAt", 'DD Mon YYYY HH24:MI:SS') AS "formattedDate"
        FROM
          public."Quotations" q
        LEFT JOIN
          public."QuotationProducts" qp ON q.id = qp."quotationId"
        LEFT JOIN
          public."Products" p ON qp."productId" = p.id
        LEFT JOIN
          public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
        LEFT JOIN
          public."Suppliers" s ON qsp."supplierId" = s.id
        LEFT JOIN
          public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        LEFT JOIN
          public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
        WHERE
          q.id IN (:quotationIds)
        ORDER BY
          q."createdAt" ASC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { quotationIds },
      }
    );

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No quotation details found for the given area" });
    }

    // Agrupar las cotizaciones por ID
    const groupedQuotations = {};
    result.forEach((row) => {
      if (!groupedQuotations[row.quotationId]) {
        groupedQuotations[row.quotationId] = {
          quotationId: row.quotationId,
          quotationName: row.quotationName,
          quotationType: row.quotationType,
          quotationPrice: row.quotationPrice,
          quotationStatus: row.quotationStatus,
          quotationCount: row.quotationCount,
          createdAt: row.createdAt,
          formattedDate: row.formattedDate,
          products: [],
        };
      }

      groupedQuotations[row.quotationId].products.push({
        productId: row.productId,
        productName: row.productName,
        productDescription: row.productDescription,
        productPhoto: row.productPhoto,
        productUnitOfMeasure: row.productUnitOfMeasure,
        productQuantity: row.productQuantity,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        supplierEmail: row.supplierEmail,
        supplierRuc: row.supplierRuc,
        supplierAddress: row.supplierAddress,
        supplierPhone: row.supplierPhone,
        supplierUnitPrice: row.supplierUnitPrice,
      });
    });

    res.json({
      success: true,
      data: Object.values(groupedQuotations),
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// const getQuotationsDetails = async (req, res) => {
//   try {
//     const { quotationIds } = req.body;

//     // Validar entrada
//     if (!Array.isArray(quotationIds) || quotationIds.length === 0) {
//       return res.status(400).json({ error: "No valid quotationIds provided." });
//     }

//     // Construir placeholders para IDs
//     const sanitizedIds = quotationIds.map((id) => `'${id}'`).join(", ");

//     const query = `
//         SELECT
//           q.id AS "quotationId",
//           q.name AS "quotationName",
//           q.type AS "quotationType",
//           q.price AS "quotationPrice",
//           q.status AS "quotationStatus",
//           q."quotationCount",
//           qp."productId",
//           p.name AS "productName",
//           p.description AS "productDescription",
//           i.url AS "productPhoto",
//           uom.value AS "productUnitOfMeasure",
//           qp.quantity AS "productQuantity",
//           qsp."supplierId",
//           s.name AS "supplierName",
//           s.email AS "supplierEmail",
//           s.ruc AS "supplierRuc",
//           s."fiscalAddress" AS "supplierAddress",
//           s."phone" AS "supplierPhone",
//           qsp."unitPrice" AS "supplierUnitPrice",
//           q."createdAt",
//           to_char(q."createdAt", 'DD Mon YYYY HH24:MI:SS') AS "formattedDate",
//           (sp."adminAuthorizedId" IS NOT NULL) AS "isAuthorized"
//         FROM
//           public."Quotations" q
//         LEFT JOIN
//           public."QuotationProducts" qp ON q.id = qp."quotationId"
//         LEFT JOIN
//           public."Products" p ON qp."productId" = p.id
//         LEFT JOIN
//           public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
//         LEFT JOIN
//           public."Suppliers" s ON qsp."supplierId" = s.id
//         LEFT JOIN
//           public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
//         LEFT JOIN
//           public."Images" i ON p."imageId" = i.id
//         LEFT JOIN
//           public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
//         WHERE
//           q.id IN (${sanitizedIds})
//       `;

//     // Ejecutar consulta
//     const results = await sequelize.query(query, {
//       type: sequelize.QueryTypes.SELECT,
//     });

//     if (!results || results.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No quotations found for the provided IDs." });
//     }

//     // Agrupar los resultados por quotationId
//     const groupedResults = results.reduce((acc, row) => {
//       if (!acc[row.quotationId]) {
//         acc[row.quotationId] = {
//           count: 0,
//           quotationId: row.quotationId,
//           name: row.quotationName,
//           formattedDate: row.formattedDate,
//           data: [],
//         };
//       }

//       acc[row.quotationId].count += 1;

//       acc[row.quotationId].data.push({
//         productId: row.productId,
//         productName: row.productName,
//         productDescription: row.productDescription,
//         productPhoto: row.productPhoto,
//         productUnitOfMeasure: row.productUnitOfMeasure,
//         productQuantity: row.productQuantity,
//         supplierId: row.supplierId,
//         supplierName: row.supplierName,
//         supplierEmail: row.supplierEmail,
//         supplierRuc: row.supplierRuc,
//         supplierAddress: row.supplierAddress,
//         supplierPhone: row.supplierPhone,
//         supplierUnitPrice: row.supplierUnitPrice,
//       });

//       return acc;
//     }, {});

//     // Convertir a un array de resultados para responder
//     const response = Object.values(groupedResults);

//     res.json({ success: true, data: response });
//   } catch (error) {
//     console.error("Error ejecutando consulta:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getQuotationsDetailsByIds = async (req, res) => {
  try {
    const { quotationIds } = req.body;

    // Validar que se haya proporcionado un array válido
    if (!Array.isArray(quotationIds) || quotationIds.length === 0) {
      return res.status(400).json({ error: "No valid quotationIds provided." });
    }

    // Extraer los IDs del array de objetos
    const ids = quotationIds.map((item) => item.Id);

    // Consultar todas las cotizaciones con los IDs proporcionados
    const results = await sequelize.query(
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
            uom.value AS "productUnitOfMeasure",
            qp.quantity AS "productQuantity",
            qsp."supplierId",
            s.name AS "supplierName",
            s.email AS "supplierEmail",
            s.ruc AS "supplierRuc",
            s."fiscalAddress" AS "supplierAddress",
            s."phone" AS "supplierPhone",
            qsp."unitPrice" AS "supplierUnitPrice",
            q."createdAt",
            to_char(q."createdAt", 'DD Mon YYYY HH24:MI:SS') AS "formattedDate",
            (sp."adminAuthorizedId" IS NOT NULL) AS "isAuthorized",
            a.id AS "areaId",
            a.name AS "areaName"
          FROM
            public."Quotations" q
          LEFT JOIN
            public."QuotationProducts" qp ON q.id = qp."quotationId"
          LEFT JOIN
            public."Products" p ON qp."productId" = p.id
          LEFT JOIN
            public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
          LEFT JOIN
            public."Suppliers" s ON qsp."supplierId" = s.id
          LEFT JOIN
            public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
          LEFT JOIN
            public."Images" i ON p."imageId" = i.id
          LEFT JOIN
            public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
          LEFT JOIN
            public."Areas" a ON q."areaId" = a.id
          WHERE
            q.id IN (:ids)
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { ids },
      }
    );

    // Si no se encuentran resultados
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ error: "No quotations found for the provided IDs." });
    }

    // Agrupar las cotizaciones por área
    const groupedByArea = results.reduce((acc, row) => {
      if (!acc[row.areaId]) {
        acc[row.areaId] = {
          areaId: row.areaId,
          areaName: row.areaName,
          quotations: [],
        };
      }

      acc[row.areaId].quotations.push({
        quotationId: row.id,
        quotationName: row.quotationName,
        type: row.type,
        price: row.quotationPrice,
        status: row.quotationStatus,
        quotationCount: row.quotationCount,
        formattedDate: row.formattedDate,
        products: [
          {
            productId: row.productId,
            productName: row.productName,
            productDescription: row.productDescription,
            productPhoto: row.productPhoto,
            productUnitOfMeasure: row.productUnitOfMeasure,
            productQuantity: row.productQuantity,
            supplierId: row.supplierId,
            supplierName: row.supplierName,
            supplierEmail: row.supplierEmail,
            supplierRuc: row.supplierRuc,
            supplierAddress: row.supplierAddress,
            supplierPhone: row.supplierPhone,
            supplierUnitPrice: row.supplierUnitPrice,
          },
        ],
      });

      return acc;
    }, {});

    // Convertir el objeto en un array
    const response = Object.values(groupedByArea);

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getQuotationDetailsByIds = async (req, res) => {
  try {
    const { quotationIds } = req.body;

    if (!Array.isArray(quotationIds) || quotationIds.length === 0) {
      return res
        .status(400)
        .json({ error: "quotationIds debe ser un array no vacío." });
    }

    const result = await sequelize.query(
      `
          SELECT
            q.id AS "quotationId",
            q.name AS "quotationName",
            q.type,
            q.price AS "quotationPrice",
            q.status AS "quotationStatus",
            q."quotationCount" AS "quotationCount",
            qp."productId",
            p.name AS "productName",
            p.description AS "productDescription",
            i.url AS "productPhoto",
            uom.value AS "productUnitOfMeasure",
            qp.quantity AS "productQuantity",
            qsp."supplierId",
            s.name AS "supplierName",
            s.email AS "supplierEmail",
            s.ruc AS "supplierRuc",
            s."fiscalAddress" AS "supplierAddress",
            s."phone" AS "supplierPhone",
            qsp."unitPrice" AS "supplierUnitPrice",
            q."createdAt",
            to_char(q."createdAt", 'DD Mon YYYY HH24:MI:SS') AS "formattedDate",
            (sp."adminAuthorizedId" IS NOT NULL) AS "isAuthorized"
          FROM
            public."Quotations" q
          LEFT JOIN
            public."QuotationProducts" qp ON q.id = qp."quotationId"
          LEFT JOIN
            public."Products" p ON qp."productId" = p.id
          LEFT JOIN
            public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
          LEFT JOIN
            public."Suppliers" s ON qsp."supplierId" = s.id
          LEFT JOIN
            public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
          LEFT JOIN
            public."Images" i ON p."imageId" = i.id
          LEFT JOIN
            public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
          WHERE
            q.id = ANY(:ids)
          ORDER BY q.id
        `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { ids: quotationIds },
      }
    );

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Quotations not found" });
    }

    // Agrupar datos por quotationId
    const groupedResult = result.reduce((acc, row) => {
      if (!acc[row.quotationId]) {
        acc[row.quotationId] = {
          quotationId: row.quotationId,
          quotationName: row.quotationName,
          type: row.type,
          price: row.quotationPrice,
          status: row.quotationStatus,
          quotationCount: row.quotationCount,
          formattedDate: row.formattedDate,
          products: [],
        };
      }

      acc[row.quotationId].products.push({
        productId: row.productId,
        productName: row.productName,
        productDescription: row.productDescription,
        productPhoto: row.productPhoto,
        productUnitOfMeasure: row.productUnitOfMeasure,
        productQuantity: row.productQuantity,
        supplier: {
          supplierId: row.supplierId,
          supplierName: row.supplierName,
          supplierEmail: row.supplierEmail,
          supplierRuc: row.supplierRuc,
          supplierAddress: row.supplierAddress,
          supplierPhone: row.supplierPhone,
          unitPrice: row.supplierUnitPrice,
          isAuthorized: row.isAuthorized,
        },
      });

      return acc;
    }, {});

    // Convertir el objeto agrupado a un array para facilitar el manejo en el frontend
    const response = Object.values(groupedResult);

    res.json({ count: response.length, quotations: response });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getQuotationsDetails = async (req, res) => {
  try {
    const { quotationIds } = req.body;

    // Validar entrada
    if (!Array.isArray(quotationIds) || quotationIds.length === 0) {
      return res.status(400).json({ error: "No valid quotationIds provided." });
    }

    // Construir placeholders para IDs
    const sanitizedIds = quotationIds.map((id) => `'${id}'`).join(", ");

    const query = `
        SELECT
          q.id AS "quotationId",
          q.name AS "quotationName",
          q.type AS "quotationType",
          q.price AS "quotationPrice",
          q.status AS "quotationStatus",
          q."quotationCount",
          qp."productId",
          p.name AS "productName",
          p.description AS "productDescription",
          i.url AS "productPhoto",
          uom.value AS "productUnitOfMeasure",
          qp.quantity AS "productQuantity",
          qsp."supplierId",
          s.name AS "supplierName",
          s.email AS "supplierEmail",
          s.ruc AS "supplierRuc",
          s."fiscalAddress" AS "supplierAddress",
          s."phone" AS "supplierPhone",
          qsp."unitPrice" AS "supplierUnitPrice",
          q."createdAt",
          to_char(q."createdAt", 'DD Mon YYYY HH24:MI:SS') AS "formattedDate",
          (sp."adminAuthorizedId" IS NOT NULL) AS "isAuthorized"
        FROM
          public."Quotations" q
        LEFT JOIN
          public."QuotationProducts" qp ON q.id = qp."quotationId"
        LEFT JOIN
          public."Products" p ON qp."productId" = p.id
        LEFT JOIN
          public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
        LEFT JOIN
          public."Suppliers" s ON qsp."supplierId" = s.id
        LEFT JOIN
          public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        LEFT JOIN
          public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
        WHERE
          q.id IN (${sanitizedIds})
      `;

    // Ejecutar consulta
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ error: "No quotations found for the provided IDs." });
    }

    // Agrupar los resultados por quotationId
    const groupedResults = results.reduce((acc, row) => {
      if (!acc[row.quotationId]) {
        acc[row.quotationId] = {
          quotationId: row.quotationId,
          quotationName: row.quotationName,
          quotationType: row.quotationType,
          quotationPrice: row.quotationPrice,
          quotationStatus: row.quotationStatus,
          quotationCount: row.quotationCount,
          createdAt: row.createdAt,
          formattedDate: row.formattedDate,
          products: [],
        };
      }

      acc[row.quotationId].products.push({
        productId: row.productId,
        productName: row.productName,
        productDescription: row.productDescription,
        productPhoto: row.productPhoto,
        productUnitOfMeasure: row.productUnitOfMeasure,
        productQuantity: row.productQuantity,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        supplierEmail: row.supplierEmail,
        supplierRuc: row.supplierRuc,
        supplierAddress: row.supplierAddress,
        supplierPhone: row.supplierPhone,
        supplierUnitPrice: row.supplierUnitPrice,
      });

      return acc;
    }, {});

    // Convertir a un array para devolver
    const response = Object.values(groupedResults).map((quotation) => ({
      count: quotation.products.length,
      name: quotation.quotationName,
      formattedDate: quotation.formattedDate,
      data: quotation.products,
    }));

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error ejecutando consulta:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//11 diciembre

const getMultipleQuotationDetails = async (req, res) => {
  try {
    const { quotationIds } = req.body; // Recibimos un array de IDs en el body

    if (!Array.isArray(quotationIds) || quotationIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty quotation IDs array" });
    }

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
          uom.value AS "productUnitOfMeasure",
          qp.quantity AS "productQuantity",
          qsp."supplierId",
          s.name AS "supplierName",
          s.email AS "supplierEmail",
          s.ruc AS "supplierRuc",
          s."fiscalAddress" AS "supplierAddress",
          s."phone" AS "supplierPhone",
          qsp."unitPrice" AS "supplierUnitPrice",
          q."createdAt",
          to_char(q."createdAt", 'DD Mon YYYY HH24:MI:SS') AS "formattedDate",
          (sp."adminAuthorizedId" IS NOT NULL) AS "isAuthorized"
        FROM
          public."Quotations" q
        LEFT JOIN
          public."QuotationProducts" qp ON q.id = qp."quotationId"
        LEFT JOIN
          public."Products" p ON qp."productId" = p.id
        LEFT JOIN
          public."QuotationSupplierProducts" qsp ON qp.id = qsp."quotationProductId"
        LEFT JOIN
          public."Suppliers" s ON qsp."supplierId" = s.id
        LEFT JOIN
          public."SupplierProducts" sp ON sp."productId" = qp."productId" AND sp."supplierId" = qsp."supplierId"
        LEFT JOIN
          public."Images" i ON p."imageId" = i.id
        LEFT JOIN
          public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id
        WHERE
          q.id IN (:quotationIds)
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { quotationIds },
      }
    );

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No quotations found for the given IDs" });
    }

    const groupedData = result.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = {
          quotationId: item.id,
          name: item.quotationName,
          formattedDate: item.formattedDate,
          products: [],
        };
      }
      acc[item.id].products.push(item);
      return acc;
    }, {});

    res.json({ data: Object.values(groupedData) });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 13 diciembre
// Obtener detalles de un proveedor por ID
const getSupplierDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOne({
      where: { id },
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

const getDefaultStructureAndArea = async (req, res) => {
  const { userId } = req.params;

  try {
    // Buscar la estructura con nombre "Sin asignar" asociada al userId
    const structure = await Structure.findOne({
      where: { userId, name: "Sin asignar" },
    });

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "Estructura 'Sin asignar' no encontrada.",
      });
    }

    // Buscar el área asociada a la estructura con tipo "Sin asignar"
    const area = await Area.findOne({
      where: { structureId: structure.id, type: "Sin asignar" },
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Área 'Sin asignar' no encontrada.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        structure,
        area,
      },
    });
  } catch (error) {
    console.error("Error al obtener estructura y área por defecto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

module.exports = {
  getProjectsByUser,
  getAreasByProject,
  createArea,
  createProject,
  updateProject,
  deleteProject,
  getQuotationsByArea,
  searchProjects,
  getProjectByQuotationId,
  updateQuotationProject,
  updateQuotationArea,
  getQuotationsDetails, //ultimo
  getQuotationsWithDetailsByArea,
  getQuotationsDetailsByIds, ///siiiiii---======
  //   nuevo

  //   getQuotationDetails,
  //11 diciembre
  getMultipleQuotationDetails,
  // 13 diciembre
  getSupplierDetails,
  getDefaultStructureAndArea,
};
