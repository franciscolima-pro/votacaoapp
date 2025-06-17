const express = require("express");
const router = express.Router();
const enqueteController = require("../controllers/enquetescontroller");

router.get("/enquetes", enqueteController.listar); 

router.get("/enquetes/:id", enqueteController.buscarEnquetePorId)

router.post("/enquetes", enqueteController.criar);

router.post("/enquetes/:id/votar", enqueteController.votarEnquete);

router.put("/enquetes/:id", enqueteController.atualizar);

router.delete("/enquetes/:id", enqueteController.deletar); 


module.exports = router;