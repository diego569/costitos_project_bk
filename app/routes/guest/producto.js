const express = require("express");
const router = express.Router();
const Producto = require("../../controllers/guest/producto");

router.get(
  "/getproductdetailsbysupplierproductslug/:supplierProductSlug",
  Producto.getProductDetailsBySupplierProductSlug
);

router.get(
  "/:productId/category-subcategory",
  Producto.getProductCategoryAndSubcategoryByProductId
);

module.exports = router;
