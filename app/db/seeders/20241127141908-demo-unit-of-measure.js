"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const unitOfMeasures = [
      { value: "UND", name: "Unidad" },
      { value: "M3", name: "Metro Cúbico" },
      { value: "M", name: "Metro Lineal" },
      { value: "SAC", name: "Saco" },
      { value: "KG", name: "Kilogramo" },
      { value: "TN", name: "Tonelada" },
      { value: "L", name: "Litro" },
      { value: "M2", name: "Metro Cuadrado" },
      { value: "GLN", name: "Galón" },
      { value: "PC", name: "Pieza" },
      { value: "BOL", name: "Bolsa" },
      { value: "PAQ", name: "Paquete" },
      { value: "ROL", name: "Rollo" },
      { value: "CAJ", name: "Caja" },
    ];

    const unitOfMeasureData = unitOfMeasures.map((unit) => ({
      id: uuidv4(),
      value: unit.value,
      name: unit.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("UnitOfMeasure", unitOfMeasureData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UnitOfMeasure", null, {});
  },
};
