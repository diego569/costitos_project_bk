const Category = require("../../models/category");
const Subcategory = require("../../models/subcategory");

const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");

const sequelize = new Sequelize(config.development);

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await sequelize.query(
      `
      SELECT
        s.id AS supplier_id,
        s.name AS supplier_name,
        s.ruc AS supplier_ruc,
        s.email AS supplier_email,
        s."enabled" AS supplier_enabled,
        s."role" AS supplier_role,
        s."contributorType" AS contributor_type,
        s."documentType" AS document_type,
        s."commercialName" AS commercial_name,
        s."registrationDate" AS registration_date,
        s."activityStartDate" AS activity_start_date,
        s."contributorStatus" AS contributor_status,
        s."contributorCondition" AS contributor_condition,
        s."fiscalAddress" AS fiscal_address,
        s."invoiceEmissionSystem" AS invoice_emission_system,
        s."foreignTradeActivity" AS foreign_trade_activity,
        s."accountingSystem" AS accounting_system,
        s."mainEconomicActivity" AS main_economic_activity,
        s."secondaryEconomicActivity1" AS secondary_economic_activity1,
        s."authorizedPaymentReceipts" AS authorized_payment_receipts,
        s."electronicEmissionSystem" AS electronic_emission_system,
        s."electronicIssuerSince" AS electronic_issuer_since,
        s."electronicReceipts" AS electronic_receipts,
        s."affiliatedToPLE" AS affiliated_to_ple,
        s."registries" AS registries,
        s."createdAt" AS created_at,
        s."updatedAt" AS updated_at,
        i.url AS supplier_image,
        u.email AS admin_authorized_email
      FROM
        public."Suppliers" s
      LEFT JOIN
        public."Images" i ON s."imageId" = i.id
      LEFT JOIN
        public."Users" u ON s."adminAuthorizedId" = u.id
      ORDER BY
        s."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      data: suppliers.map((s) => ({
        id: s.supplier_id,
        name: s.supplier_name,
        ruc: s.supplier_ruc,
        email: s.supplier_email,
        enabled: s.supplier_enabled,
        role: s.supplier_role,
        contributorType: s.contributor_type,
        documentType: s.document_type,
        commercialName: s.commercial_name,
        registrationDate: s.registration_date,
        activityStartDate: s.activity_start_date,
        contributorStatus: s.contributor_status,
        contributorCondition: s.contributor_condition,
        fiscalAddress: s.fiscal_address,
        invoiceEmissionSystem: s.invoice_emission_system,
        foreignTradeActivity: s.foreign_trade_activity,
        accountingSystem: s.accounting_system,
        mainEconomicActivity: s.main_economic_activity,
        secondaryEconomicActivity1: s.secondary_economic_activity1,
        authorizedPaymentReceipts: s.authorized_payment_receipts,
        electronicEmissionSystem: s.electronic_emission_system,
        electronicIssuerSince: s.electronic_issuer_since,
        electronicReceipts: s.electronic_receipts,
        affiliatedToPLE: s.affiliated_to_ple,
        registries: s.registries,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        image: s.supplier_image,
        adminAuthorizedEmail: s.admin_authorized_email,
      })),
      count: suppliers.length,
    });
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getCategoriesBySupplier = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const categories = await sequelize.query(
      `
      SELECT DISTINCT
        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        c.photo AS category_photo
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      JOIN
        public."Categories" c ON sc."categoryId" = c.id
      WHERE
        sp."supplierId" = :supplierId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId },
      }
    );

    res.status(200).json({
      data: categories.map((category) => ({
        id: category.category_id,
        name: category.category_name,
        slug: category.category_slug,
        photo: category.category_photo,
      })),
      count: categories.length,
    });
  } catch (error) {
    console.error("Error al obtener las categorías del proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getSubcategoriesByCategoryAndSupplier = async (req, res) => {
  const { supplierId, categoryId } = req.params;
  try {
    const subcategories = await sequelize.query(
      `
      SELECT DISTINCT
        sc.id AS subcategory_id,
        sc.name AS subcategory_name,
        sc.slug AS subcategory_slug,
        sc.photo AS subcategory_photo
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      WHERE
        sp."supplierId" = :supplierId
        AND sc."categoryId" = :categoryId
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, categoryId },
      }
    );

    res.status(200).json({
      data: subcategories.map((subcategory) => ({
        id: subcategory.subcategory_id,
        name: subcategory.subcategory_name,
        slug: subcategory.subcategory_slug,
        photo: subcategory.subcategory_photo,
      })),
      count: subcategories.length,
    });
  } catch (error) {
    console.error(
      "Error al obtener las subcategorías del proveedor y categoría:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getProductsBySubcategoryAndSupplier = async (req, res) => {
  const { subcategorySlug, supplierId } = req.params;
  try {
    const products = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        p.name AS product_name,
        p.description AS product_description,
        sp.slug AS supplier_product_slug,
        i.url AS product_image,
        uom.name AS unit_of_measure,   
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized   
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id   
      WHERE
        sc.slug = :subcategorySlug
        AND sp."supplierId" = :supplierId
      ORDER BY
        sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { subcategorySlug, supplierId },
      }
    );

    res.status(200).json({
      data: products.map((product) => ({
        id: product.supplier_product_id,
        name: product.product_name,
        description: product.product_description,
        slug: product.supplier_product_slug,
        photo: product.product_image,
        unitOfMeasure: product.unit_of_measure,
        isAuthorized: product.is_authorized,
      })),
      count: products.length,
    });
  } catch (error) {
    console.error(
      "Error al obtener los productos por subcategoría y proveedor:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const searchProductsBySupplier = async (req, res) => {
  const { supplierId } = req.params;
  const { query } = req.query;

  try {
    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        uom.name AS product_unitOfMeasure,  -- Obtener el nombre de la unidad de medida
        p.id AS product_id,
        p.name AS product_name,
        sp.slug AS product_slug,
        p.description AS product_description,
        i.url AS product_photo,
        sp."createdAt" AS created_at,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  -- Verificar si está autorizado
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  -- Unir con UnitOfMeasure
      WHERE
        sp."supplierId" = :supplierId
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        p.id, sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, query: `%${query}%` },
      }
    );

    const products = result.map((product) => ({
      id: product.supplier_product_id,
      name: product.product_name,
      description: product.product_description,
      slug: product.product_slug,
      photo: product.product_photo,
      unitOfMeasure: product.product_unitOfMeasure, // Usar el nombre de la unidad de medida
      isAuthorized: product.is_authorized, // Devolver true o false según la autorización
    }));

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const searchProductsByCategoryAndSupplier = async (req, res) => {
  const { supplierId, categoryId } = req.params;
  const { query } = req.query;

  try {
    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        uom.name AS product_unitOfMeasure,  -- Obtener el nombre de la unidad de medida
        p.id AS product_id,
        p.name AS product_name,
        sp.slug AS product_slug,
        p.description AS product_description,
        i.url AS product_photo,
        sp."createdAt" AS created_at,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  -- Verificar si está autorizado
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  -- Unir con UnitOfMeasure
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      JOIN
        public."Categories" c ON sc."categoryId" = c.id
      WHERE
        sp."supplierId" = :supplierId
        AND c.id = :categoryId
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        p.id, sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, categoryId, query: `%${query}%` },
      }
    );

    const products = result.map((product) => ({
      id: product.supplier_product_id,
      name: product.product_name,
      description: product.product_description,
      slug: product.product_slug,
      photo: product.product_photo,
      unitOfMeasure: product.product_unitOfMeasure, // Usar el nombre de la unidad de medida
      isAuthorized: product.is_authorized, // Devolver true o false según la autorización
    }));

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error(
      "Error al buscar productos por categoría y proveedor:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const searchProductsBySubcategoryAndSupplier = async (req, res) => {
  const { supplierId, subcategoryId } = req.params;
  const { query } = req.query;

  try {
    const result = await sequelize.query(
      `
      SELECT
        sp.id AS supplier_product_id,
        uom.name AS product_unitOfMeasure,  -- Obtener el nombre de la unidad de medida
        p.id AS product_id,
        p.name AS product_name,
        sp.slug AS product_slug,
        p.description AS product_description,
        i.url AS product_photo,
        sp."createdAt" AS created_at,
        (sp."adminAuthorizedId" IS NOT NULL) AS is_authorized  -- Verificar si está autorizado
      FROM
        public."SupplierProducts" sp
      JOIN
        public."Products" p ON sp."productId" = p.id
      LEFT JOIN
        public."Images" i ON p."imageId" = i.id
      LEFT JOIN
        public."UnitOfMeasure" uom ON sp."unitOfMeasureId" = uom.id  -- Unir con UnitOfMeasure
      JOIN
        public."Subcategories" sc ON p."subcategoryId" = sc.id
      WHERE
        sp."supplierId" = :supplierId
        AND sc.id = :subcategoryId
        AND (p.name ILIKE :query OR p.description ILIKE :query)
      ORDER BY
        p.id, sp."createdAt" DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { supplierId, subcategoryId, query: `%${query}%` },
      }
    );

    const products = result.map((product) => ({
      id: product.supplier_product_id,
      name: product.product_name,
      description: product.product_description,
      slug: product.product_slug,
      photo: product.product_photo,
      unitOfMeasure: product.product_unitOfMeasure, // Usar el nombre de la unidad de medida
      isAuthorized: product.is_authorized, // Devolver true o false según la autorización
    }));

    res.status(200).json({
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error(
      "Error al buscar productos por subcategoría y proveedor:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getSuppliers,
  getCategoriesBySupplier,
  getSubcategoriesByCategoryAndSupplier,
  getProductsBySubcategoryAndSupplier,
  searchProductsBySupplier,
  searchProductsByCategoryAndSupplier,
  searchProductsBySubcategoryAndSupplier,
};
