const express = require("express");
const router = express.Router();
const Carrito = require("../../controllers/supplier/carrito");

router.post("/addsupplierproducts/", Carrito.addSupplierProducts);

module.exports = router;
