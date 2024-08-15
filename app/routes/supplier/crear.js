const express = require("express");
const router = express.Router();
const Crear = require("../../controllers/supplier/crear");
const uploadMiddleware = require("../../../utils/handleStorage");

router.post(
  "/uploadimage",
  uploadMiddleware.single("myfile"),
  Crear.createItem
);

router.post("/createproduct", Crear.createProduct);
router.post("/createsupplierproduct", Crear.createSupplierProduct);

module.exports = router;
