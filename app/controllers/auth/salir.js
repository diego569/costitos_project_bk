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

const logout = (req, res) => {
  try {
    // Aquí puedes agregar cualquier lógica adicional que necesites al cerrar sesión
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  logout,
};
