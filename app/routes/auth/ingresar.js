const express = require("express");
const router = express.Router();
const Ingresar = require("../../controllers/auth/ingresar");

router.post("/login", Ingresar.login);

module.exports = router;
