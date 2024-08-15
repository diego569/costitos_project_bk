const { handleHttpError } = require("../../utils/handleError");

const checkRolUser = (allowedRoles) => (req, res, next) => {
  try {
    const { user } = req;
    const userRole = user.role;

    if (!allowedRoles.includes(userRole)) {
      return handleHttpError(
        res,
        "El usuario no tiene permisos para acceder a esta ruta",
        403
      );
    }

    next();
  } catch (error) {
    console.error("Error en el middleware de verificación de roles:", error);
    return handleHttpError(res, "Error interno del servidor", 500);
  }
};
const checkRolSupplier = (allowedRoles) => (req, res, next) => {
  try {
    const { supplier } = req;
    const supplierRole = supplier.role;

    if (!allowedRoles.includes(supplierRole)) {
      return handleHttpError(
        res,
        "El usuario no tiene permisos para acceder a esta ruta",
        403
      );
    }

    next();
  } catch (error) {
    console.error("Error en el middleware de verificación de roles:", error);
    return handleHttpError(res, "Error interno del servidor", 500);
  }
};

module.exports = { checkRolUser, checkRolSupplier };
