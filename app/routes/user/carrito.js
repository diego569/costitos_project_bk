const express = require("express");
const router = express.Router();
const Carrito = require("../../controllers/user/carrito");

router.post("/createquotation/", Carrito.createQuotation);

router.post("/addproductstoquotation/", Carrito.addProductsToQuotation);

router.post(
  "/addquotationsupplierproducts/",
  Carrito.addQuotationSupplierProducts
);

module.exports = router;
