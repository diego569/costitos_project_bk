"use strict";
const { hashPassword } = require("../../../utils/handlePassword");
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const images = await queryInterface.sequelize.query(
      'SELECT id FROM "Images";'
    );
    const imageRows = images[0];

    const generatePhoneNumber = () => {
      return `9${Math.floor(10000000 + Math.random() * 90000000)}`;
    };

    // Datos específicos (5 registros basados en el PDF)
    const fixedSuppliers = [
      {
        id: uuidv4(),
        name: "Zambrano Guillermo Jenny Margarita",
        ruc: "10426046046",
        email: "zambrano.jenny@example.com",
        password: await hashPassword("password123"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "supplier",
        adminAuthorizedId: null,
        imageId: imageRows[0]?.id || null,
        contributorType: "PERSONA NATURAL CON NEGOCIO",
        documentType: "DNI 42604604",
        commercialName: null,
        registrationDate: new Date("2017-12-15"),
        activityStartDate: new Date("2017-12-15"),
        contributorStatus: "ACTIVO",
        contributorCondition: "HABIDO",
        fiscalAddress: "Jr. Los Tulipanes 123, Lima",
        invoiceEmissionSystem: "MANUAL/COMPUTARIZADO",
        foreignTradeActivity: "SIN ACTIVIDAD",
        accountingSystem: "MANUAL",
        mainEconomicActivity:
          "VENTA AL POR MENOR DE ARTÍCULOS DE FERRETERÍA, PINTURAS Y PRODUCTOS DE VIDRIO",
        secondaryEconomicActivity1:
          "VENTA AL POR MENOR DE OTROS PRODUCTOS NUEVOS",
        authorizedPaymentReceipts: "FACTURA, BOLETA",
        electronicEmissionSystem: "FACTURA PORTAL DESDE 20/01/2021",
        electronicIssuerSince: new Date("2021-01-18"),
        electronicReceipts: "BOLETA, FACTURA",
        affiliatedToPLE: false,
        registries: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Distribuidora La Estrella S.A.",
        ruc: "20587956432",
        email: "contacto@laestrella.com",
        password: await hashPassword("estrella123"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "supplier",
        adminAuthorizedId: null,
        imageId: imageRows[1]?.id || null,
        contributorType: "SOCIEDAD ANÓNIMA",
        documentType: "RUC",
        commercialName: "Distribuidora Estrella",
        registrationDate: new Date("2015-10-01"),
        activityStartDate: new Date("2015-11-15"),
        contributorStatus: "ACTIVO",
        contributorCondition: "HABIDO",
        fiscalAddress: "Av. Las Palmeras 456, Arequipa",
        invoiceEmissionSystem: "ELECTRÓNICO",
        foreignTradeActivity: "SIN ACTIVIDAD",
        accountingSystem: "COMPUTARIZADO",
        mainEconomicActivity: "COMERCIO MAYORISTA DE ALIMENTOS Y BEBIDAS",
        secondaryEconomicActivity1: "COMERCIO MENORISTA DE VARIOS PRODUCTOS",
        authorizedPaymentReceipts: "FACTURA, BOLETA",
        electronicEmissionSystem: "PORTAL DESDE 10/01/2018",
        electronicIssuerSince: new Date("2018-01-10"),
        electronicReceipts: "FACTURA, BOLETA",
        affiliatedToPLE: true,
        registries: "Padrones SUNAT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Servicios Industriales Perea E.I.R.L.",
        ruc: "20458912345",
        email: "ventas@serviciosperea.com",
        password: await hashPassword("perea123"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "supplier",
        adminAuthorizedId: null,
        imageId: imageRows[2]?.id || null,
        contributorType: "EMPRESA INDIVIDUAL DE RESPONSABILIDAD LIMITADA",
        documentType: "RUC",
        commercialName: "Servicios Perea",
        registrationDate: new Date("2012-03-25"),
        activityStartDate: new Date("2012-04-01"),
        contributorStatus: "ACTIVO",
        contributorCondition: "HABIDO",
        fiscalAddress: "Calle Los Andes 789, Cusco",
        invoiceEmissionSystem: "MANUAL",
        foreignTradeActivity: "SIN ACTIVIDAD",
        accountingSystem: "MANUAL",
        mainEconomicActivity:
          "MANTENIMIENTO Y REPARACIÓN DE MAQUINARIA INDUSTRIAL",
        secondaryEconomicActivity1: "COMERCIO DE REPUESTOS INDUSTRIALES",
        authorizedPaymentReceipts: "FACTURA, BOLETA",
        electronicEmissionSystem: "FACTURA PORTAL DESDE 15/01/2020",
        electronicIssuerSince: new Date("2020-01-15"),
        electronicReceipts: "FACTURA",
        affiliatedToPLE: true,
        registries: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Comercial Soluciones Rápidas S.A.C.",
        ruc: "20658741236",
        email: "info@solucionesrapidas.com",
        password: await hashPassword("soluciones123"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "supplier",
        adminAuthorizedId: null,
        imageId: imageRows[3]?.id || null,
        contributorType: "SOCIEDAD COMERCIAL DE RESPONSABILIDAD LIMITADA",
        documentType: "RUC",
        commercialName: "Soluciones Express",
        registrationDate: new Date("2016-09-12"),
        activityStartDate: new Date("2016-10-01"),
        contributorStatus: "ACTIVO",
        contributorCondition: "HABIDO",
        fiscalAddress: "Jr. Las Flores 321, Trujillo",
        invoiceEmissionSystem: "ELECTRÓNICO",
        foreignTradeActivity: "SIN ACTIVIDAD",
        accountingSystem: "MANUAL",
        mainEconomicActivity: "VENTA AL POR MAYOR DE MATERIAL DE CONSTRUCCIÓN",
        secondaryEconomicActivity1: null,
        authorizedPaymentReceipts: "FACTURA, BOLETA",
        electronicEmissionSystem: "PORTAL DESDE 01/01/2021",
        electronicIssuerSince: new Date("2021-01-01"),
        electronicReceipts: "FACTURA, BOLETA",
        affiliatedToPLE: false,
        registries: "Ninguno",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Talleres Mecánicos Ruiz S.A.C.",
        ruc: "20345876124",
        email: "talleresruiz@example.com",
        password: await hashPassword("ruiz123"),
        phone: generatePhoneNumber(),
        enabled: true,
        role: "supplier",
        adminAuthorizedId: null,
        imageId: imageRows[4]?.id || null,
        contributorType: "SOCIEDAD ANÓNIMA CERRADA",
        documentType: "RUC",
        commercialName: "Taller Ruiz",
        registrationDate: new Date("2013-07-01"),
        activityStartDate: new Date("2013-08-01"),
        contributorStatus: "ACTIVO",
        contributorCondition: "HABIDO",
        fiscalAddress: "Av. Industrial 987, Chiclayo",
        invoiceEmissionSystem: "MANUAL",
        foreignTradeActivity: "SIN ACTIVIDAD",
        accountingSystem: "COMPUTARIZADO",
        mainEconomicActivity: "SERVICIO DE MANTENIMIENTO MECÁNICO",
        secondaryEconomicActivity1: "VENTA DE REPUESTOS MECÁNICOS",
        authorizedPaymentReceipts: "FACTURA",
        electronicEmissionSystem: "NO APLICA",
        electronicIssuerSince: null,
        electronicReceipts: null,
        affiliatedToPLE: false,
        registries: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Generación automática de datos (15 registros)
    const generateSuppliers = async () => {
      const suppliers = [];
      for (let i = 0; i < 15; i++) {
        const randomImageId =
          imageRows[Math.floor(Math.random() * imageRows.length)]?.id || null;

        suppliers.push({
          id: uuidv4(),
          name: faker.company.name(),
          ruc: faker.string.numeric(11),
          email: faker.internet.email(),
          password: await hashPassword("supplierDefault"),
          phone: generatePhoneNumber(),
          enabled: true,
          role: "supplier",
          adminAuthorizedId: null,
          imageId: randomImageId,
          contributorType: faker.helpers.arrayElement([
            "PERSONA NATURAL CON NEGOCIO",
            "SOCIEDAD ANÓNIMA",
          ]),
          documentType: "RUC",
          commercialName: faker.company.name(),
          registrationDate: faker.date.past({ years: 10, refDate: new Date() }),
          activityStartDate: faker.date.past({ years: 9, refDate: new Date() }),
          contributorStatus: faker.helpers.arrayElement(["ACTIVO", "INACTIVO"]),
          contributorCondition: faker.helpers.arrayElement([
            "HABIDO",
            "NO HABIDO",
          ]),
          fiscalAddress: faker.location.streetAddress(),
          invoiceEmissionSystem: faker.helpers.arrayElement([
            "MANUAL",
            "ELECTRÓNICO",
          ]),
          foreignTradeActivity: faker.helpers.arrayElement([
            "SIN ACTIVIDAD",
            "ACTIVO",
          ]),
          accountingSystem: faker.helpers.arrayElement([
            "MANUAL",
            "COMPUTARIZADO",
          ]),
          mainEconomicActivity: faker.commerce.department(),
          secondaryEconomicActivity1: faker.commerce.department(),
          authorizedPaymentReceipts: "FACTURA, BOLETA",
          electronicEmissionSystem: "PORTAL DESDE 20/01/2021",
          electronicIssuerSince: faker.date.past({
            years: 3,
            refDate: new Date(),
          }),
          electronicReceipts: "FACTURA, BOLETA",
          affiliatedToPLE: faker.datatype.boolean(),
          registries: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return suppliers;
    };

    const autoGeneratedSuppliers = await generateSuppliers();

    // Combinar datos fijos y generados
    const suppliersData = [...fixedSuppliers, ...autoGeneratedSuppliers];

    // Insertar en la tabla Suppliers
    await queryInterface.bulkInsert("Suppliers", suppliersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Suppliers", null, {});
  },
};
