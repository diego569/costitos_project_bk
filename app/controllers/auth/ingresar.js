const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const User = require("../../models/user");
const Supplier = require("../../models/supplier");

const { generateToken } = require("../../../utils/handleToken");
const {
  hashPassword,
  comparePassword,
} = require("../../../utils/handlePassword");
require("dotenv").config();

const sequelize = new Sequelize(config.development);

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    let role = null;

    // Busca el usuario por email en la base de datos de usuarios
    user = await User.findOne({ where: { email } });
    role = "user";

    // Si no se encuentra el usuario, busca en la tabla de proveedores
    if (!user) {
      user = await Supplier.findOne({ where: { email } });
      role = "supplier";
    }

    // Si no se encuentra ni el usuario ni el proveedor, devuelve un error 404
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario o proveedor no encontrado" });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
    const isPasswordValid = await comparePassword(password, user.password);

    // Si la contraseña no es válida, devuelve un error 401
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Genera un token de autenticación
    const token = generateToken(user);

    // Prepara la respuesta según el tipo de usuario
    const responseData = {
      id: user.id,
      name: role === "user" ? user.firstName : user.name,
      role: role === "user" ? user.role : role,
    };

    // Retorna los datos del usuario/proveedor y el token en la respuesta
    res.status(200).json({
      data: responseData,
      token,
    });
  } catch (error) {
    // Manejo de errores: registra el error y devuelve un error 500
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  login,
};
