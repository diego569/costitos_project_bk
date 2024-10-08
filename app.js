const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const config = require("./config/config");
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Mi Aplicación",
      version: "1.0.0",
      description: "Documentación de la API de Mi Aplicación",
    },
  },
  apis: ["./app/routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
const sequelize = new Sequelize(config.development);

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static("storage"));
app.use("/", require("./app/routes"));

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "APP Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
