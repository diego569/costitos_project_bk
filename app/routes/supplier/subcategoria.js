const express = require("express");
const router = express.Router();
const Subcategoria = require("../../controllers/supplier/subcategoria");

router.get(
  "/getrecentproductsbysubcategory/:subcategorySlug",
  Subcategoria.getRecentProductsBySubcategory
);

router.get(
  "/searchrecentproductsbysubcategory/:subcategorySlug",
  Subcategoria.searchRecentProductsBySubcategory
);

module.exports = router;
