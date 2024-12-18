const express = require("express");
const router = express.Router();
const Perfil = require("../../controllers/user/perfil");

router.get("/:userId", Perfil.getUserProfile);

router.put("/:userId", Perfil.updateUserProfile);

module.exports = router;
