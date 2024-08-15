const express = require("express");
const router = express.Router();
const Registrarse = require("../../controllers/auth/registrarse");

router.post("/register", Registrarse.registerUser);

module.exports = router;
