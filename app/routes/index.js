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

    if (file.startsWith(".")) {
      return;
    }
    const fileWithOutExt = removeExtension(file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadRoutes(fullPath);
    } else {
      const routePath = path.relative(pathRouter, fullPath).replace(/\\/g, "/");
      const route = `/${routePath.split(".").shift().replace(/\\/g, "/")}`;

      if (!["index"].includes(fileWithOutExt)) {
        router.use(route, require(fullPath));
      }
    }
  });
};

loadRoutes(pathRouter);

router.get("*", (req, res) => {
  res.status(404);
  res.send({ error: "Not found" });
});

module.exports = router;
