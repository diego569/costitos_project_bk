const express = require("express");
const router = express.Router();
const Catalogo = require("../../controllers/guest/catalogo");

router.get("/search", Catalogo.searchSupplierProducts);
router.get("/getcategories", Catalogo.getCategories);
router.get("/getrecentsupplierproducts", Catalogo.getRecentSupplierProducts);
router.get("/getmostquotedproducts", Catalogo.getMostQuotedProducts);

module.exports = router;
