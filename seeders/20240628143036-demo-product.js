"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
  async up(queryInterface, Sequelize) {
    const subcategories = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Subcategories";'
    );
    const images = await queryInterface.sequelize.query(
      'SELECT id FROM "Images";'
    );
    const suppliers = await queryInterface.sequelize.query(
      'SELECT id FROM "Suppliers";'
    );
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );

    const subcategoryRows = subcategories[0];
    const imageRows = images[0];
    const supplierRows = suppliers[0];
    const userRows = users[0];

    // Función para generar slug
    const generateSlug = (name) => slugify(name, { lower: true });

    // Productos basados en los datos proporcionados
    const manualProducts = [
      {
        name: "Arena Gruesa",
        subcategory: "Cementos y Agregados",
      },
      {
        name: 'Piedra Chancada de 1/2"',
        subcategory: "Cementos y Agregados",
      },
      {
        name: 'Piedra Mediana T.M=6"',
        subcategory: "Cementos y Agregados",
      },
      {
        name: 'Piedra Grande T.M=8"',
        subcategory: "Cementos y Agregados",
      },
      {
        name: 'Material Granular T.M 2"',
        subcategory: "Cementos y Agregados",
      },
      {
        name: "Placha Acero ASTM A709 G50 Dim=600x600x12.00mm",
        subcategory: "Acero de Refuerzo",
      },
      {
        name: "Placha Acero ASTM A709 G50 Dim=300x300x9.50mm",
        subcategory: "Acero de Refuerzo",
      },
      {
        name: 'Tubo Redondo LAC ASTM A500, Diam=2" e=2.5mm',
        subcategory: "Acero de Refuerzo",
      },
      {
        name: "Ladrillo Arcilla 8 Hueco, 15x30x30 cm",
        subcategory: "Materiales de Construcción",
      },
      {
        name: "Cobertura TR-4 Acero Aluzinc ASTM-A792, E=0.40MM",
        subcategory: "Coberturas",
      },
    ];

    // Mapear productos a subcategorías, asignando relaciones dinámicamente
    const mappedManualProducts = manualProducts.map((product) => {
      const matchingSubcategory = subcategoryRows.find(
        (sub) => sub.name === product.subcategory
      );
      const randomImageId =
        imageRows[Math.floor(Math.random() * imageRows.length)].id;
      const randomSupplierId =
        supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
      const randomAdminId =
        userRows[Math.floor(Math.random() * userRows.length)].id;

      return {
        id: uuidv4(),
        name: product.name,
        slug: generateSlug(product.name),
        description: faker.commerce.productDescription(),
        imageId: randomImageId,
        subcategoryId: matchingSubcategory?.id || null,
        status: faker.helpers.arrayElement(["available", "unavailable"]),
        supplierId: randomSupplierId,
        adminAuthorizedId: randomAdminId,
        creationDate: faker.date.past({ years: 1, refDate: new Date() }),
        authorizationDate: faker.helpers.maybe(
          () => faker.date.recent({ days: 30, refDate: new Date() }),
          {
            probability: 0.5,
          }
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Generar productos adicionales aleatorios para completar el total
    const additionalProducts = [];
    for (let i = 0; i < 50; i++) {
      const randomSubcategory =
        subcategoryRows[Math.floor(Math.random() * subcategoryRows.length)];
      const randomImageId =
        imageRows[Math.floor(Math.random() * imageRows.length)].id;
      const randomSupplierId =
        supplierRows[Math.floor(Math.random() * supplierRows.length)].id;
      const randomAdminId =
        userRows[Math.floor(Math.random() * userRows.length)].id;

      const productName = faker.commerce.productName();

      additionalProducts.push({
        id: uuidv4(),
        name: productName,
        slug: generateSlug(productName),
        description: faker.commerce.productDescription(),
        imageId: randomImageId,
        subcategoryId: randomSubcategory.id,
        status: faker.helpers.arrayElement(["available", "unavailable"]),
        supplierId: randomSupplierId,
        adminAuthorizedId: randomAdminId,
        creationDate: faker.date.past({ years: 1, refDate: new Date() }),
        authorizationDate: faker.helpers.maybe(
          () => faker.date.recent({ days: 30, refDate: new Date() }),
          {
            probability: 0.5,
          }
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Combinar productos manuales con adicionales
    const productsData = [...mappedManualProducts, ...additionalProducts];

    await queryInterface.bulkInsert("Products", productsData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
