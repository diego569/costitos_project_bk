"use strict";

const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los IDs de los proyectos (Structures) existentes
    const structures = await queryInterface.sequelize.query(
      'SELECT id FROM "Structures";'
    );
    const structureRows = structures[0];

    // Asegúrate de que hay proyectos en la tabla Structures
    if (structureRows.length === 0) {
      throw new Error(
        "Se necesita al menos un proyecto en la tabla Structures."
      );
    }

    const generateAreas = () => {
      const areas = [];

      // Crear un área "Sin asignar" para cada estructura
      structureRows.forEach((structure) => {
        areas.push({
          id: uuidv4(),
          name: null,
          description: null,
          type: "Sin asignar",
          structureId: structure.id, // Asociado al proyecto correspondiente
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      // Agregar registros específicos adicionales (opcional)
      const firstStructureId = structureRows[0].id;

      areas.push(
        {
          id: uuidv4(),
          name: "Estructuras - Nivel Primaria",
          description: "Infraestructura educativa para el nivel primaria.",
          type: "Estructuras",
          structureId: firstStructureId, // Asociado al primer proyecto
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Estructuras - Nivel Secundaria",
          description: "Infraestructura educativa para el nivel secundaria.",
          type: "Estructuras",
          structureId: firstStructureId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Saneamiento - Instalaciones Sanitarias",
          description: "Rediseño de las instalaciones de saneamiento.",
          type: "Saneamiento",
          structureId: firstStructureId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );

      // Si hay más de un proyecto, agregar un registro específico para el segundo proyecto
      if (structureRows.length > 1) {
        areas.push({
          id: uuidv4(),
          name: "Urbanización - Áreas Comunes",
          description: "Adecuación de áreas comunes y vías de acceso.",
          type: "Urbanización",
          structureId: structureRows[1].id, // Asociado al segundo proyecto
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Registros aleatorios generados con Faker
      for (let i = 0; i < 6; i++) {
        const randomStructureId =
          structureRows[Math.floor(Math.random() * structureRows.length)].id;

        areas.push({
          id: uuidv4(),
          name: `${faker.helpers.arrayElement([
            "Estructuras",
            "Saneamiento",
            "Urbanización",
            "Electricidad",
            "Vías de Acceso",
          ])} - ${faker.location.cityName()}`,
          description: faker.lorem.sentence(),
          type: faker.helpers.arrayElement([
            "Estructuras",
            "Saneamiento",
            "Urbanización",
            "Electricidad",
          ]),
          structureId: randomStructureId, // Asociado a un proyecto aleatorio
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return areas;
    };

    const areasData = generateAreas();
    await queryInterface.bulkInsert("Areas", areasData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Areas", null, {});
  },
};
