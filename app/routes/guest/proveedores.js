const express = require("express");
const router = express.Router();
const Proveedores = require("../../controllers/guest/proveedores");

router.get("/getsuppliers/", Proveedores.getSuppliers);
router.get(
  "/getcategoriesbysupplier/:supplierId",
  Proveedores.getCategoriesBySupplier
);

router.get(
  "/getsubcategoriesbysupplier/:supplierId/:categoryId",
  Proveedores.getSubcategoriesByCategoryAndSupplier
);

router.get(
  "/getproductsbysupplier/:supplierId/subcategory/:subcategorySlug",
  Proveedores.getProductsBySubcategoryAndSupplier
);

router.get(
  "/searchProductsBySupplier/:supplierId",
  Proveedores.searchProductsBySupplier
);

router.get(
  "/searchProductsBySupplierAndCategory/:supplierId/:categoryId",
  Proveedores.searchProductsByCategoryAndSupplier
);
router.get(
  "/searchProductsBySubcategoryAndSupplier/:supplierId/:subcategoryId",
  Proveedores.searchProductsBySubcategoryAndSupplier
);
module.exports = router;
