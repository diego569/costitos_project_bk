const express = require("express");
const router = express.Router();
const Explorar = require("../../controllers/supplier/explorar");

router.get("/getrecentproductsexplorar/", Explorar.getRecentProductsExplorar);
router.get("/getcategories", Explorar.getCategories);
router.get(
  "/searchrecentproductsexplorar",
  Explorar.searchRecentProductsExplorar
);
module.exports = router;
