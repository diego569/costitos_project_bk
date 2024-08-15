const express = require("express");
const router = express.Router();
const Subcategory = require("../../controllers/guest/subcategory");

router.get(
  "/searchsupplierproductsbysubcategory/:subcategorySlug",
  Subcategory.searchSupplierProductsBySubcategory
);
router.get(
  "/getrecentsupplierproductsbysubcategory/:subcategorySlug",
  Subcategory.getRecentSupplierProductsBySubcategory
);
router.get(
  "/getmostquotedproductsbysubcategory/:subcategorySlug",
  Subcategory.getMostQuotedProductsBySubcategory
);

module.exports = router;
