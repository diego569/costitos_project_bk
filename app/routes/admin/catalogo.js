const express = require("express");
const router = express.Router();
const Catalogo = require("../../controllers/admin/catalogo");

router.get(
  "/getcategoriesbysupplier2/:supplierId",
  Catalogo.getCategoriesBySupplier
);

router.get(
  "/getsubcategoriesbysupplierandcategory/:supplierId/:categoryId",
  Catalogo.getSubcategoriesBySupplierAndCategory
);

router.get("/products", Catalogo.getAllProducts);

router.get(
  "/getproductsbycategory/:categoryId",
  Catalogo.getProductsByCategory
);

router.get(
  "/getproductsbysubcategory/:subcategoryId",
  Catalogo.getProductsBySubcategory
);

router.get("/searchproducts", Catalogo.searchProducts);

router.get(
  "/searchproductsbycategory/:categoryId",
  Catalogo.searchProductsByCategory
);

router.get(
  "/searchproductsbysubcategory/:subcategoryId",
  Catalogo.searchProductsBySubcategory
);

//
router.get("/getcategories", Catalogo.getCategories);
router.get(
  "/getsubcategoriesbycategory/:categoryId",
  Catalogo.getSubcategoriesByCategoryId
);
module.exports = router;
