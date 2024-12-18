// "use strict";
// const { v4: uuidv4 } = require("uuid");
// const { faker } = require("@faker-js/faker");
// const slugify = require("slugify");

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Consultar los datos necesarios de la base de datos
//     const products = await queryInterface.sequelize.query(
//       'SELECT id, name FROM "Products";'
//     );
//     const suppliers = await queryInterface.sequelize.query(
//       'SELECT id FROM "Suppliers";'
//     );
//     const units = await queryInterface.sequelize.query(
//       'SELECT id, value FROM "UnitOfMeasure";'
//     );

//     const productRows = products[0];
//     const supplierRows = suppliers[0];
//     const unitRows = units[0];

//     // Función para generar un slug único para cada combinación
//     const generateSlug = (name, supplierId, unitValue) => {
//       return slugify(`${name}-${supplierId}-${unitValue}`, { lower: true });
//     };

//     // Generar combinaciones completas de SupplierProducts
//     const generateSupplierProducts = () => {
//       const supplierProducts = [];
//       const uniqueCombinationSet = new Set();

//       // Iterar por cada proveedor
//       for (const supplier of supplierRows) {
//         // Iterar por cada producto
//         for (const product of productRows) {
//           // Iterar por cada unidad de medida
//           for (const unit of unitRows) {
//             const combinationKey = `${product.id}-${supplier.id}-${unit.id}`;

//             // Evitar duplicados
//             if (uniqueCombinationSet.has(combinationKey)) {
//               continue;
//             }

//             uniqueCombinationSet.add(combinationKey);

//             // Generar slug
//             const slug = generateSlug(product.name, supplier.id, unit.value);

//             // Crear SupplierProduct
//             supplierProducts.push({
//               id: uuidv4(),
//               supplierId: supplier.id,
//               productId: product.id,
//               slug: slug,
//               price: faker.number.float({
//                 min: 10,
//                 max: 5000,
//                 multipleOf: 0.01, // Usar multipleOf en lugar de precision
//               }),
//               unitOfMeasureId: unit.id,
//               adminAuthorizedId: null, // Se puede ajustar si es necesario
//               status: faker.helpers.arrayElement(["active", "inactive"]),
//               createdAt: new Date(),
//               updatedAt: new Date(),
//             });
//           }
//         }
//       }

//       return supplierProducts;
//     };

//     // Generar los datos de SupplierProducts
//     const supplierProductsData = generateSupplierProducts();

//     // Insertar los datos generados
//     await queryInterface.bulkInsert(
//       "SupplierProducts",
//       supplierProductsData,
//       {}
//     );
//   },

//   // Método para revertir la operación de inserción
//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete("SupplierProducts", null, {});
//   },
// };

// "use strict";
// const { v4: uuidv4 } = require("uuid");
// const { faker } = require("@faker-js/faker");
// const slugify = require("slugify");

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Consultar datos necesarios de la base de datos
//     const products = await queryInterface.sequelize.query(
//       'SELECT id, name FROM "Products";',
//       { type: Sequelize.QueryTypes.SELECT }
//     );
//     const suppliers = await queryInterface.sequelize.query(
//       'SELECT id FROM "Suppliers";',
//       { type: Sequelize.QueryTypes.SELECT }
//     );
//     const units = await queryInterface.sequelize.query(
//       'SELECT id, value FROM "UnitOfMeasure";',
//       { type: Sequelize.QueryTypes.SELECT }
//     );

//     // Función para generar un slug único
//     const generateSlug = (name, supplierId, unitValue) => {
//       return slugify(`${name}-${supplierId}-${unitValue}`, { lower: true });
//     };

//     // Asignar una unidad de medida única a cada producto
//     const assignUniqueUnitsToProducts = (products, units) => {
//       const productUnitMap = {};
//       products.forEach((product, index) => {
//         const unit = units[index % units.length]; // Asignar unidades de forma cíclica
//         productUnitMap[product.id] = unit; // Mapear producto a unidad
//       });
//       return productUnitMap;
//     };

//     // Generar datos de SupplierProducts
//     const generateSupplierProducts = (products, suppliers, productUnitMap) => {
//       const supplierProducts = [];
//       const uniqueCombinationSet = new Set();

//       suppliers.forEach((supplier) => {
//         // Seleccionar aleatoriamente el 80%-90% de productos
//         const selectedProducts = faker.helpers
//           .shuffle(products)
//           .slice(
//             0,
//             Math.ceil(
//               products.length * faker.number.float({ min: 0.8, max: 0.9 })
//             )
//           );

//         selectedProducts.forEach((product) => {
//           const unit = productUnitMap[product.id]; // Unidad asignada al producto

//           const combinationKey = `${product.id}-${supplier.id}-${unit.id}`;
//           if (!uniqueCombinationSet.has(combinationKey)) {
//             uniqueCombinationSet.add(combinationKey);

//             const slug = generateSlug(product.name, supplier.id, unit.value);

//             supplierProducts.push({
//               id: uuidv4(),
//               supplierId: supplier.id,
//               productId: product.id,
//               slug: slug,
//               price: faker.number.float({
//                 min: 10,
//                 max: 5000,
//                 multipleOf: 0.01,
//               }),
//               unitOfMeasureId: unit.id,
//               adminAuthorizedId: null,
//               status: "active",
//               createdAt: new Date(),
//               updatedAt: new Date(),
//             });
//           }
//         });
//       });

//       return supplierProducts;
//     };

//     // 1. Asignar unidades de medida únicas a cada producto
//     const productUnitMap = assignUniqueUnitsToProducts(products, units);

//     // 2. Generar los datos de SupplierProducts
//     const supplierProductsData = generateSupplierProducts(
//       products,
//       suppliers,
//       productUnitMap
//     );

//     // 3. Insertar los datos generados
//     await queryInterface.bulkInsert(
//       "SupplierProducts",
//       supplierProductsData,
//       {}
//     );
//   },

//   // Método para revertir la operación de inserción
//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete("SupplierProducts", null, {});
//   },
// };

"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Consultar datos necesarios de la base de datos
    const products = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Products";',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const units = await queryInterface.sequelize.query(
      'SELECT id, value FROM "UnitOfMeasure";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Función para generar un slug único
    const generateSlug = (name, supplierId, unitValue) => {
      return slugify(`${name}-${supplierId}-${unitValue}`, { lower: true });
    };

    // Asignar una unidad de medida única a cada producto
    const assignUniqueUnitsToProducts = (products, units) => {
      const productUnitMap = {};
      products.forEach((product) => {
        const unit = faker.helpers.arrayElement(units); // Asignar una unidad aleatoria única
        productUnitMap[product.id] = unit; // Mapear producto a su unidad asignada
      });
      return productUnitMap;
    };

    // Generar datos de SupplierProducts
    const generateSupplierProducts = (products, suppliers, productUnitMap) => {
      const supplierProducts = [];
      const uniqueCombinationSet = new Set();

      suppliers.forEach((supplier) => {
        // Seleccionar aleatoriamente el 80%-90% de productos
        const selectedProducts = faker.helpers
          .shuffle(products)
          .slice(
            0,
            Math.ceil(
              products.length * faker.number.float({ min: 0.8, max: 0.9 })
            )
          );

        selectedProducts.forEach((product) => {
          const unit = productUnitMap[product.id]; // Unidad asignada al producto

          const combinationKey = `${product.id}-${supplier.id}-${unit.id}`;
          if (!uniqueCombinationSet.has(combinationKey)) {
            uniqueCombinationSet.add(combinationKey);

            const slug = generateSlug(product.name, supplier.id, unit.value);

            supplierProducts.push({
              id: uuidv4(),
              supplierId: supplier.id,
              productId: product.id,
              slug: slug,
              price: faker.number.float({
                min: 10,
                max: 5000,
                multipleOf: 0.01,
              }),
              unitOfMeasureId: unit.id,
              adminAuthorizedId: null,
              status: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        });
      });

      return supplierProducts;
    };

    // 1. Asignar una unidad de medida única a cada producto
    const productUnitMap = assignUniqueUnitsToProducts(products, units);

    // 2. Generar los datos de SupplierProducts
    const supplierProductsData = generateSupplierProducts(
      products,
      suppliers,
      productUnitMap
    );

    // 3. Insertar los datos generados
    await queryInterface.bulkInsert(
      "SupplierProducts",
      supplierProductsData,
      {}
    );
  },

  // Método para revertir la operación de inserción
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SupplierProducts", null, {});
  },
};
