const express = require("express");
const router = express.Router();
const Categoria = require("../../controllers/guest/categoria");

router.get(
  "/searchsupplierproductsbycategory/:categorySlug",
  Categoria.searchSupplierProductsByCategory
);
router.get(
  "/getsubcategoriesbycategoryslug/:slug",
  Categoria.getSubcategoriesByCategorySlug
);
router.get(
  "/getrecentsupplierproductsbycategory/:categorySlug",
  Categoria.getRecentSupplierProductsByCategory
);
router.get(
  "/getmostquotedproductsbycategory/:categorySlug",
  Categoria.getMostQuotedProductsByCategory
);

module.exports = router;
