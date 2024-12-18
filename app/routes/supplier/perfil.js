const express = require("express");
const router = express.Router();
const Perfil = require("../../controllers/supplier/perfil");

router.get("/:supplierId", Perfil.getSupplierProfile);
router.put("/:supplierId", Perfil.updateSupplierProfile);

module.exports = router;
