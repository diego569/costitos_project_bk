const express = require("express");
const router = express.Router();
const Projectos = require("../../controllers/user/proyectos");

router.get("/:userId", Projectos.getProjectsByUser);
router.get("/:structureId/areas", Projectos.getAreasByProject);

router.post("/:id/areas/agregar", Projectos.createArea);

router.post("/crear/proyecto", Projectos.createProject);
router.put("/:structureId/editar", Projectos.updateProject);
router.delete("/:structureId/eliminar", Projectos.deleteProject);

router.get("/areas/:areaId/cotizaciones", Projectos.getQuotationsByArea);

router.get("/buscar/:userId", Projectos.searchProjects);

// ------
// Ruta para obtener el proyecto asociado a una cotización por su ID
// router.get("/:quotationId/proyecto", Projectos.getProjectByQuotationId);

// Ruta para actualizar el proyecto asociado a una cotización
router.put("/:quotationId/project", Projectos.updateQuotationProject);

// ---
router.put("/:quotationId/area", Projectos.updateQuotationArea);

router.get(
  "/areas/:areaId/quotations",
  Projectos.getQuotationsWithDetailsByArea
);

router.post("/quotations/details", Projectos.getQuotationsDetails); //ultimo
router.post("/quotationsdetails", Projectos.getQuotationsDetailsByIds); /// siiiii------

// router.get("/quotations/:quotationId", Projectos.getQuotationsDetails);

// nuevo

// router.post("/quotations/details", Projectos.getQuotationDetailsByIds);
//11 diciembre

router.post(
  "/quotationdetails/multiple",
  Projectos.getMultipleQuotationDetails
);

// 13 diciembre
router.get("/suppliers/:id", Projectos.getSupplierDetails);

router.get("/default/:userId", Projectos.getDefaultStructureAndArea);

module.exports = router;
