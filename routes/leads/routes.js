const express = require('express');
const controller = require("../../controllers/lead");
const { authJwt } = require("../../middlewares");

const router = express.Router()

//Post Method
router.post('/', [authJwt.verifyToken], controller.addLead)

//Get all Method
router.get('/', [authJwt.verifyToken], controller.getAllLeads)

//Get by ID Method
router.get('/:id', [authJwt.verifyToken], controller.getLeadById)

//Update by ID Method
router.put('/:id', [authJwt.verifyToken], controller.updateLead)

//Delete by ID Method
router.delete('/:id', [authJwt.verifyToken], controller.deleteLead)

module.exports = router;