const express = require("express");
const router = express.Router();
const Misproductos = require("../../controllers/supplier/misproductos");

router.get(
  "/getcategoriesbysupplier2/:supplierId",
  Misproductos.getCategoriesBySupplier
);

router.get(
  "/getsubcategoriesbysupplierandcategory/:supplierId/:categoryId",
  Misproductos.getSubcategoriesBySupplierAndCategory
);

router.get(
  "/getproductsbysupplier/:supplierId",
  Misproductos.getProductsBySupplier
);

router.get(
  "/getproductsbysupplierandcategory/:supplierId/:categoryId",
  Misproductos.getProductsBySupplierAndCategory
);

router.get(
  "/getproductsbysupplierandsubcategory/:supplierId/:subcategoryId",
  Misproductos.getProductsBySupplierAndSubcategory
);

router.get(
  "/searchproductsbysupplier/:supplierId",
  Misproductos.searchProductsBySupplier
);

router.get(
  "/searchproductsbysupplierandcategory/:supplierId/:categoryId",
  Misproductos.searchProductsBySupplierAndCategory
);

router.get(
  "/searchproductsbysupplierandsubcategory/:supplierId/:subcategoryId",
  Misproductos.searchProductsBySupplierAndSubcategory
);

//
router.get("/getcategories", Misproductos.getCategories);
router.get(
  "/getsubcategoriesbycategory/:categoryId",
  Misproductos.getSubcategoriesByCategoryId
);
module.exports = router;
