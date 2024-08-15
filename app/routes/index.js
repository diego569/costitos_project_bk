const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const pathRouter = __dirname;

const removeExtension = (fileName) => {
  return fileName.split(".").shift();
};

const loadRoutes = (directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);

    // Ignorar archivos ocultos como .DS_Store
    if (file.startsWith(".")) {
      return;
    }

    const fileWithOutExt = removeExtension(file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      // Recursivamente cargar rutas de subdirectorios
      loadRoutes(fullPath);
    } else {
      const routePath = path.relative(pathRouter, fullPath).replace(/\\/g, "/"); // Reemplaza las barras invertidas en Windows
      const route = `/${routePath.split(".").shift().replace(/\\/g, "/")}`;

      if (!["index"].includes(fileWithOutExt)) {
        router.use(route, require(fullPath));
        console.log("CARGAR RUTA ---->", route);
      }
    }
  });
};

// Cargar todas las rutas
loadRoutes(pathRouter);

router.get("*", (req, res) => {
  res.status(404);
  res.send({ error: "Not found" });
});

module.exports = router;
