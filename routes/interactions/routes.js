const express = require('express');
const controller = require("../../controllers/interactions");
const { authJwt } = require("../../middlewares");

const router = express.Router()

//Post Method
router.post('/', [authJwt.verifyToken], controller.addInteraction)

//Get all Method
router.get('/', [authJwt.verifyToken], controller.getAllInteractions)

//Get by ID Method
router.get('/:id', [authJwt.verifyToken], controller.getInteractionById)

//Update by ID Method
router.put('/:id', [authJwt.verifyToken], controller.updateInteraction)

//Delete by ID Method
router.delete('/:id', [authJwt.verifyToken], controller.deleteInteraction)

module.exports = router;