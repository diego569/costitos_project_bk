const express = require("express");
const router = express.Router();
const Categoria = require("../../controllers/supplier/categoria");

router.get(
  "/searchrecentproductsbycategory/:categorySlug",
  Categoria.searchRecentProductsByCategory
);

router.get(
  "/getsubcategoriesbycategoryslug/:slug",
  Categoria.getSubcategoriesByCategorySlug
);

router.get(
  "/getrecentproductsbycategory/:categorySlug",
  Categoria.getRecentProductsByCategory
);

module.exports = router;
