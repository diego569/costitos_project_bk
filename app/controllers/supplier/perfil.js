const { Sequelize, Op, fn, col, literal } = require("sequelize");
const config = require("../../../config/config");
const Supplier = require("../../models/supplier");

const sequelize = new Sequelize(config.development);
const { v4: uuidv4 } = require("uuid");

const getSupplierProfile = async (req, res) => {
  const { supplierId } = req.params;

  try {
    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }

    res.status(200).json({ data: supplier });
  } catch (error) {
    console.error("Error al obtener el perfil del proveedor:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el perfil del proveedor." });
  }
};

const updateSupplierProfile = async (req, res) => {
  const { supplierId } = req.params;
  const updatedData = req.body;

  try {
    const supplier = await Supplier.findByPk(supplierId);

    if (!supplier) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }

    await supplier.update(updatedData);

    res
      .status(200)
      .json({ message: "Perfil del proveedor actualizado con éxito." });
  } catch (error) {
    console.error("Error al actualizar el perfil del proveedor:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el perfil del proveedor." });
  }
};

module.exports = {
  getSupplierProfile,
  updateSupplierProfile,
};
