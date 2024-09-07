const { Sequelize, Op, fn, col, literal } = require("sequelize");
const User = require("../../models/user");
const Supplier = require("../../models/supplier");
const { generateToken } = require("../../../utils/handleToken");
const { hashPassword } = require("../../../utils/handlePassword");
require("dotenv").config();

const registerUser = async (req, res) => {
  const {
    dni,
    firstName,
    lastName,
    email,
    password,
    paymentType,
    terms,
    businessName,
    ruc,
    legalRepresentative,
    phone,
  } = req.body;

  if (!terms) {
    return res.status(400).json({
      message: "Debe aceptar los términos y condiciones para continuar.",
    });
  }

  try {
    const existingEntity = await (businessName ? Supplier : User).findOne({
      where: { email },
    });

    if (existingEntity) {
      return res
        .status(400)
        .json({ message: "El usuario o proveedor ya existe" });
    }

    const hashedPassword = await hashPassword(password);

    let newEntity;

    if (businessName) {
      newEntity = await Supplier.create({
        name: businessName,
        businessName,
        ruc,
        legalRepresentative,
        phone,
        email,
        password: hashedPassword,
        role: "supplier",
      });
    } else {
      newEntity = await User.create({
        firstName,
        lastName,
        dni,
        email,
        password: hashedPassword,
        role: "user",
        paymentType,
        quotationCount: 3,
      });
    }

    const token = generateToken(newEntity);

    const responseData = {
      id: newEntity.id,
      name: newEntity.firstName || newEntity.businessName,
      role: newEntity.role,
    };

    res.status(201).json({
      data: responseData,
      token,
    });
  } catch (error) {
    console.error("Error al registrar usuario/proveedor:", error);
    res.status(500).json({ error: "Error al registrar usuario/proveedor" });
  }
};

module.exports = {
  registerUser,
};
