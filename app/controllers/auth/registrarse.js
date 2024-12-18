const { Sequelize, Op, fn, col, literal } = require("sequelize");
const User = require("../../models/user");
const Supplier = require("../../models/supplier");
const Structure = require("../../models/structure");
const Area = require("../../models/area");
const { generateToken } = require("../../../utils/handleToken");
const { hashPassword } = require("../../../utils/handlePassword");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const registerUser = async (req, res) => {
  const { dni, firstName, lastName, email, password, terms, ruc, phone } =
    req.body;

  if (!terms) {
    return res.status(400).json({
      success: false,
      message: "Debe aceptar los términos y condiciones para continuar.",
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    const existingSupplier = ruc
      ? await Supplier.findOne({ where: { ruc } })
      : null;

    if (existingUser || existingSupplier) {
      return res.status(400).json({
        success: false,
        message: "El usuario/proveedor ya existe.",
      });
    }

    const hashedPassword = await hashPassword(password);

    let newEntity;

    if (ruc) {
      newEntity = await Supplier.create({
        id: uuidv4(),
        name: "Proveedor",
        ruc,
        email,
        password: hashedPassword,
        role: "supplier",
        documentType: "RUC",
        phone,
        enabled: true,
      });
    } else {
      newEntity = await User.create({
        id: uuidv4(),
        firstName,
        lastName,
        dni,
        email,
        password: hashedPassword,
        role: "user",
        paymentType: "cotización",
        quotationCount: 3,
      });

      const newProject = await Structure.create({
        id: uuidv4(),
        name: "Sin asignar",
        unifiedCode: "0000",
        description: "Proyecto creado por defecto.",
        userId: newEntity.id,
      });

      await Area.create({
        id: uuidv4(),
        type: "Sin asignar",
        structureId: newProject.id,
      });
    }

    const token = generateToken({
      id: newEntity.id,
      role: newEntity.role,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newEntity.id,
        name: newEntity.name || `${newEntity.firstName} ${newEntity.lastName}`,
        role: newEntity.role,
      },
      token,
      message: "Registro exitoso.",
    });
  } catch (error) {
    console.error("Error al registrar usuario/proveedor:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};

module.exports = {
  registerUser,
};
