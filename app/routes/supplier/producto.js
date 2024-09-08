const express = require("express");
const router = express.Router();
const Producto = require("../../controllers/supplier/producto");

router.get("/:productId/features", Producto.getProductFeaturesByProductId);

module.exports = router;
