// const bcryptjs = require("bcryptjs");

/**
 * Contraseña sin encriptar: hola.01
 * @param {*} passwordPlain
 */
// const encrypt = async (passwordPlain) => {
//   if (!passwordPlain) {
//     throw new Error("Password is undefined");
//   }
//   const hash = await bcryptjs.hash(passwordPlain, 10);
//   return hash;
// };

const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const hash = bcrypt.hash(password, 10);
  return hash;
};
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };

// const compare = async (passwordPlain, hashPassword) => {
//   return await bcryptjs.compare(passwordPlain, hashPassword);
// };

// module.exports = { encrypt, compare };
