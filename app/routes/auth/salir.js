const express = require("express");
const router = express.Router();
const Salir = require("../../controllers/auth/salir");

router.post("/logout", Salir.logout);

module.exports = router;
