"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener productos de cotización y proveedores existentes
    const quotationProducts = await queryInterface.sequelize.query(
      'SELECT id FROM "QuotationProducts";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );

    const quotationProductRows = quotationProducts[0];
    const supplierRows = suppliers[0];

    // Validación de datos
    if (quotationProductRows.length === 0 || supplierRows.length === 0) {
      throw new Error(
        "No se encontraron productos de cotización o proveedores en la base de datos."
      );
    }

    // Generar datos dinámicos con un máximo de 6 proveedores por cotización
    const generateQuotationSupplierProducts = () => {
      const quotationSupplierProducts = [];
      const supplierCountPerQuotation = {}; // Rastreo de cuántos proveedores tiene cada producto

      quotationProductRows.forEach((quotationProduct) => {
        const productId = quotationProduct.id;

        // Inicializa el contador si aún no existe
        if (!supplierCountPerQuotation[productId]) {
          supplierCountPerQuotation[productId] = 0;
        }

        // Verificar cuántos proveedores pueden ser añadidos (máximo 6)
        const remainingSlots = 6 - supplierCountPerQuotation[productId];
        if (remainingSlots > 0) {
          const numSuppliers = Math.min(remainingSlots, supplierRows.length);
          const selectedSuppliers = supplierRows.slice(0, numSuppliers); // Tomar los primeros N proveedores

          selectedSuppliers.forEach((supplier) => {
            quotationSupplierProducts.push({
              id: uuidv4(),
              quotationProductId: productId,
              supplierId: supplier.id,
              unitPrice: faker.number.float({
                min: 50,
                max: 5000,
                multipleOf: 0.01,
              }),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          });

          // Incrementar el contador de proveedores para este producto
          supplierCountPerQuotation[productId] += selectedSuppliers.length;
        }
      });

      return quotationSupplierProducts;
    };

    const dynamicQuotationSupplierProducts =
      generateQuotationSupplierProducts();

    // Insertar datos en la tabla
    await queryInterface.bulkInsert(
      "QuotationSupplierProducts",
      dynamicQuotationSupplierProducts,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("QuotationSupplierProducts", null, {});
  },
};
