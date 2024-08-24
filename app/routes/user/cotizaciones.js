const express = require("express");
const router = express.Router();
const Cotizaciones = require("../../controllers/user/cotizaciones");

router.get(
  "/getquotationbyid/:userId",
  // authMiddlewareUser,
  // checkRolUser(["superadmin", "normal", "admin"]),
  Cotizaciones.getQuotationsByUser
);

router.get("/quotationdatails/:quotationId", Cotizaciones.getQuotationDetails);

router.get("/:id/quotationcount", Cotizaciones.getQuotationCountById);

router.put("/quotationdatails/:quotationId", Cotizaciones.updateQuotationName);

module.exports = router;
