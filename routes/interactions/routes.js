const express = require('express');
const controller = require("../../controllers/interaction");
const { authJwt } = require("../../middlewares");

const router = express.Router()

//Post Method
router.post('/', [authJwt.verifyToken], controller.addInteraction)

//Get all Method
router.get('/', [authJwt.verifyToken], controller.getAllInteractions)

//Get by ID Method
router.get('/:id', [authJwt.verifyToken], controller.getInteractionById)

//Get interactions on a lead Method
router.get('/:leadId', [authJwt.verifyToken], controller.getInteractionsOnALead)

//Get interactions on a contact Method
router.get('/:contactId', [authJwt.verifyToken], controller.getInteractionsOnAContact)

//Update by ID Method
router.put('/:id', [authJwt.verifyToken], controller.updateInteraction)

//Delete by ID Method
router.delete('/:id', [authJwt.verifyToken], controller.deleteInteraction)

module.exports = router;