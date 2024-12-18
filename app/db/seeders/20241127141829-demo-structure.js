"use strict";
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtener los usuarios existentes
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";'
    );
    const userRows = users[0];

    if (userRows.length === 0) {
      throw new Error("No se encontraron usuarios en la base de datos.");
    }

    const generateStructures = () => {
      const structures = [
        // Registro con el nombre "Sin asignar"
        {
          id: uuidv4(),
          name: "Sin asignar",
          description: null,
          projectName: null,
          goals: null,
          unifiedCode: null,
          location: null,
          modularCode: null,
          date: null,
          designer: null,
          executionTime: null,
          userId: userRows[0].id, // Asigna el primer usuario encontrado
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Registro real basado en la información proporcionada
        {
          id: uuidv4(),
          name: "Mejoramiento de los Servicios Educativos en Charamuray",
          description:
            "Proyecto para mejorar la infraestructura educativa de la I.E. N°56258 en Charamuray, Colquemarca, Chumbivilcas, Cusco.",
          projectName:
            "MEJORAMIENTO DE LOS SERVICIOS EDUCATIVOS DEL NIVEL PRIMARIA Y SECUNDARIA DE LA I.E. N°56258 DE LA COMUNIDAD DE CHARAMURAY",
          goals:
            "INFRAESTRUCTURA EDUCATIVA DE LA I.E. PRIMARIA Y SECUNDARIA N°56258",
          unifiedCode: "2536037",
          location: "Colquemarca - Chumbivilcas - Cusco",
          modularCode: "Primaria: 0233767 - Secundaria: 1392091",
          date: new Date("2024-01-15"),
          designer: "CONSORCIO LIARES",
          executionTime: 270,
          userId: userRows[0].id, // Asigna el primer usuario encontrado
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Generar 19 registros adicionales con Faker
      for (let i = 0; i < 19; i++) {
        const location = `${faker.location.city()} - ${faker.location.state()} - ${faker.location.country()}`;
        const projectName = `Mejoramiento de los Servicios Educativos en ${faker.location.cityName()}`;
        const goals = `INFRAESTRUCTURA EDUCATIVA DE LA I.E. ${faker.helpers.replaceSymbols(
          "###"
        )}`;
        const modularCode = `Primaria: ${faker.helpers.replaceSymbols(
          "######"
        )} - Secundaria: ${faker.helpers.replaceSymbols("######")}`;
        const designer = faker.company.name();

        structures.push({
          id: uuidv4(),
          name: projectName,
          description: faker.lorem.paragraph(),
          projectName,
          goals,
          unifiedCode: faker.helpers.replaceSymbols("########"),
          location,
          modularCode,
          date: faker.date.future(),
          designer,
          executionTime: faker.number.int({ min: 180, max: 365 }),
          userId: userRows[Math.floor(Math.random() * userRows.length)].id, // Asigna un usuario aleatorio
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return structures;
    };

    const structuresData = generateStructures();
    await queryInterface.bulkInsert("Structures", structuresData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Structures", null, {});
  },
};
