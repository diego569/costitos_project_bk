const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const User = require("../../models/user");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "dni", "email", "firstName", "lastName"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el perfil del usuario." });
  }
};

// Actualizar el perfil del usuario
const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { dni, email, firstName, lastName } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Actualizar los campos del usuario
    user.dni = dni || user.dni;
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();

    res.status(200).json({ message: "Perfil actualizado con éxito." });
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el perfil del usuario." });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
