const sequelize = require("./config/config");
const Usuarios = require("./Usuarios");
// const Proveedores = require('./models/Proveedores');
// const Categorias = require('./models/Categorias');
// const Subcategorias = require('./models/Subcategorias');
// const Productos = require('./models/Productos');
// const Caracteristicas = require('./models/Caracteristicas');
// const Producto_Caracteristicas = require('./models/Producto_Caracteristicas');
// const Proveedor_Producto = require('./models/Proveedor_Producto');
// const Cotizaciones = require('./models/Cotizaciones');
// const Cotizacion_Productos = require('./models/Cotizacion_Productos');
// const Cotizacion_Proveedor_Productos = require('./models/Cotizacion_Proveedor_Productos');
// const Pagos = require('./models/Pagos');
// const Historial_Productos = require('./models/Historial_Productos');
// const Historial_Usuarios_Proveedores = require('./models/Historial_Usuarios_Proveedores');

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Omitir { force: true } después de la primera sincronización
    console.log("Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("Error sincronizando las tablas: ", error);
  }
};

module.exports = syncDatabase;
