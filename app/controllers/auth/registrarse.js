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
    role,
  } = req.body;

  try {
    // Verificar si el usuario o proveedor ya existe
    const existingEntity = await (role === "supplier"
      ? Supplier
      : User
    ).findOne({ where: { email } });

    if (existingEntity) {
      return res
        .status(400)
        .json({ message: "El usuario o proveedor ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(password);

    let newEntity;

    if (role === "supplier") {
      // Registrar proveedor
      newEntity = await Supplier.create({
        name: businessName, // Asignar businessName al campo name
        businessName,
        ruc,
        legalRepresentative,
        phone,
        email,
        password: hashedPassword,
        role: "supplier", // Rol de proveedor
      });
    } else {
      // Registrar usuario
      newEntity = await User.create({
        firstName,
        lastName,
        dni,
        email,
        password: hashedPassword,
        role: "user", // Rol de usuario normal
        paymentType,
      });
    }

    // Generar un token de autenticación
    const token = generateToken(newEntity);

    // Preparar la respuesta
    const responseData = {
      id: newEntity.id,
      name: newEntity.firstName || newEntity.businessName,
      role: newEntity.role,
    };

    // Retornar los datos del usuario/proveedor y el token en la respuesta
    res.status(201).json({
      data: responseData,
      token,
    });
  } catch (error) {
    // Manejo de errores: registra el error y devuelve un error 500
    console.error("Error al registrar usuario/proveedor:", error);
    res.status(500).json({ error: "Error al registrar usuario/proveedor" });
  }
};

module.exports = {
  registerUser,
};
