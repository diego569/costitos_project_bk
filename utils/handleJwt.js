// const jwt = require("jsonwebtoken");
// const TOKEN_SECRET = process.env.JWT_SECRET;
// const getProperties = require("../utils/handlePropertiesEngine");
// const propertiesKey = getProperties();
/**
 * Debes de pasar el objecto del usario
 * @param {*} user
 */
// const tokenSign = async (user) => {
//   const sign = jwt.sign(
//     {
//       [propertiesKey.id]: user[propertiesKey.id],
//       role: user.role,
//     },
//     JWT_SECRET,
//     {
//       expiresIn: "2h",
//     }
//   );

//   return sign;
// };
const tokenSign = async (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

/**
 * Debes de pasar el token de session el JWT
 * @param {*} tokenJwt
 * @returns
 */
// const verifyToken = async (tokenJwt) => {
//   try {
//     return jwt.verify(tokenJwt, JWT_SECRET);
//   } catch (e) {
//     return null;
//   }
// };

const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_SECRET = process.env.JWT_SECRET;
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { generateToken };

module.exports = { tokenSign, verifyToken };
