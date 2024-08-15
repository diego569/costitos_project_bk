const { handleHttpError } = require("../../utils/handleError");
const { verifyToken } = require("../../utils/handleToken");
const User = require("../models/user");
const Supplier = require("../models/supplier");

// const authMiddleware = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       return handleHttpError(res, "No se proporcionó un token de sesión", 401);
//     }
//     const token = req.headers.authorization.split(" ").pop();

//     try {
//       const dataToken = await verifyToken(token);

//       if (!dataToken) {
//         return handleHttpError(
//           res,
//           "El token no contiene datos de usuario",
//           401
//         );
//       }

//       const user = await User.findOne({ where: { id: dataToken.id } });
//       if (!user) {
//         return handleHttpError(
//           res,
//           "El usuario asociado al token no fue encontrado",
//           401
//         );
//       }

//       req.user = user;

//       next();
//     } catch (error) {
//       // Manejar errores al verificar el token
//       console.error("Error al verificar el token:", error);
//       return handleHttpError(res, "Error al verificar el token", 401);
//     }
//   } catch (error) {
//     // Manejar otros errores
//     console.error("Error en el middleware de autenticación:", error);
//     return handleHttpError(res, "Error interno del servidor", 500);
//   }
// };
const authMiddlewareUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return handleHttpError(res, "No se proporcionó un token de sesión", 401);
    }
    const token = req.headers.authorization.split(" ").pop();

    try {
      const dataToken = await verifyToken(token);

      if (!dataToken) {
        return handleHttpError(
          res,
          "El token no contiene datos de usuario",
          401
        );
      }

      const user = await User.findOne({ where: { id: dataToken.id } });
      if (!user) {
        return handleHttpError(
          res,
          "El usuario asociado al token no fue encontrado",
          401
        );
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return handleHttpError(res, "Error al verificar el token", 401);
    }
  } catch (error) {
    console.error("Error en el middleware de autenticación:", error);
    return handleHttpError(res, "Error interno del servidor", 500);
  }
};

const authMiddlewareSupplier = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return handleHttpError(res, "No se proporcionó un token de sesión", 401);
    }
    const token = req.headers.authorization.split(" ").pop();

    try {
      const dataToken = await verifyToken(token);

      if (!dataToken) {
        return handleHttpError(
          res,
          "El token no contiene datos de proveedor",
          401
        );
      }

      const supplier = await Supplier.findOne({ where: { id: dataToken.id } });
      if (!supplier) {
        return handleHttpError(
          res,
          "El proveedor asociado al token no fue encontrado",
          401
        );
      }

      req.supplier = supplier;
      next();
    } catch (error) {
      console.error("Error al verificar el token:", error);
      return handleHttpError(res, "Error al verificar el token", 401);
    }
  } catch (error) {
    console.error("Error en el middleware de autenticación:", error);
    return handleHttpError(res, "Error interno del servidor", 500);
  }
};

module.exports = { authMiddlewareUser, authMiddlewareSupplier };
