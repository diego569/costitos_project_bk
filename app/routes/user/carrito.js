const express = require("express");
const router = express.Router();
const Carrito = require("../../controllers/user/carrito");

router.post("/createquotation/", Carrito.createQuotation);

router.post("/addproductstoquotation/", Carrito.addProductsToQuotation);

router.post(
  "/addquotationsupplierproducts/",
  Carrito.addQuotationSupplierProducts
);

router.get("/suppliers", Carrito.getSuppliers);

router.post("/suppliers-with-products", Carrito.getSuppliersWithProducts);

module.exports = router;
