// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const TOKEN_SECRET = process.env.JWT_SECRET;

// const generateToken = (user) => {
//   return jwt.sign({ id: user.id, email: user.email }, TOKEN_SECRET, {
//     expiresIn: "2h",
//   });
// };

// const verifyToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, TOKEN_SECRET);
//     return decoded;
//   } catch (error) {
//     throw new Error("Token inválido");
//   }
// };

// module.exports = { generateToken, verifyToken };
const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_SECRET = process.env.JWT_SECRET;

const generateToken = (entity) => {
  const payload = {
    id: entity.id,
    email: entity.email,
    // Agrega otras propiedades comunes aquí, como 'role', 'name', etc.
    // Por ejemplo:
    role: entity.role,
  };

  return jwt.sign(payload, TOKEN_SECRET, {
    expiresIn: "2h",
  });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Token inválido");
  }
};

module.exports = { generateToken, verifyToken };
