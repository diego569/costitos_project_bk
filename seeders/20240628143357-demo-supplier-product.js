"use strict";
const { v4: uuidv4 } = require("uuid");
const { es, fakerES } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Products";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );

    const productRows = products[0];
    const supplierRows = suppliers[0];

    const generateSlug = (name, unitOfMeasure, supplierId) => {
      const slugName = `${name} ${unitOfMeasure} ${supplierId}`;
      return slugify(slugName, { lower: true, strict: true });
    };

    const randomDate = (start, end) => {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    };

    const generateSupplierProducts = async () => {
      const supplierProducts = [];
      const multipleMeasureProducts = new Set();

      for (const supplier of supplierRows) {
        // Generar entre 30 y 80 productos por proveedor
        const numberOfProducts = fakerES.number.int({ min: 30, max: 80 });

        for (let i = 0; i < numberOfProducts; i++) {
          const randomProduct =
            productRows[Math.floor(Math.random() * productRows.length)];
          const randomUnitOfMeasure = fakerES.helpers.arrayElement([
            "kg",
            "cm",
            "unidad",
          ]);
          const slug = generateSlug(
            randomProduct.name,
            randomUnitOfMeasure,
            supplier.id
          );

          supplierProducts.push({
            id: uuidv4(),
            supplierId: supplier.id,
            productId: randomProduct.id,
            slug: slug,
            price: fakerES.number.float({
              min: 10,
              max: 5000,
              multipleOf: 0.01,
            }),
            unitOfMeasure: randomUnitOfMeasure,
            adminAuthorizedId: null,
            status: fakerES.helpers.arrayElement(["active", "inactive"]),
            createdAt: randomDate(new Date(2022, 0, 1), new Date()),
            updatedAt: new Date(),
          });

          if (multipleMeasureProducts.size < 10) {
            multipleMeasureProducts.add(randomProduct.id);
          }
        }
      }

      // Para algunos productos, añadir más versiones con diferentes medidas
      multipleMeasureProducts.forEach((productId) => {
        const product = productRows.find((p) => p.id === productId);
        const numberOfMeasures = fakerES.helpers.arrayElement([2, 3]);
        const usedMeasures = new Set();

        for (let j = 0; j < numberOfMeasures; j++) {
          let randomUnitOfMeasure;
          do {
            randomUnitOfMeasure = fakerES.helpers.arrayElement([
              "kg",
              "cm",
              "unidad",
            ]);
          } while (usedMeasures.has(randomUnitOfMeasure));
          usedMeasures.add(randomUnitOfMeasure);

          const randomSupplierId =
            supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
          const slug = generateSlug(
            product.name,
            randomUnitOfMeasure,
            randomSupplierId
          );

          supplierProducts.push({
            id: uuidv4(),
            supplierId: randomSupplierId,
            productId: product.id,
            slug: slug,
            price: fakerES.number.float({
              min: 10,
              max: 5000,
              multipleOf: 0.01,
            }),
            unitOfMeasure: randomUnitOfMeasure,
            adminAuthorizedId: null,
            status: fakerES.helpers.arrayElement(["active", "inactive"]),
            createdAt: randomDate(new Date(2022, 0, 1), new Date()),
            updatedAt: new Date(),
          });
        }
      });

      return supplierProducts;
    };

    const supplierProductsData = await generateSupplierProducts();
    await queryInterface.bulkInsert("SupplierProducts", supplierProductsData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SupplierProducts", null, {});
  },
};
