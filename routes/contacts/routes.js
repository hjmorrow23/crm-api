const express = require('express');
const controller = require("../../controllers/contact");
const { authJwt } = require("../../middlewares");

const router = express.Router()

//Post Method
router.post('/', [authJwt.verifyToken], controller.addContact)

//Get all Method
router.get('/', [authJwt.verifyToken], controller.getAllContacts)

//Get by ID Method
router.get('/:id', [authJwt.verifyToken], controller.getContactById)

//Update by ID Method
router.put('/:id', [authJwt.verifyToken], controller.updateContact)

//Delete by ID Method
router.delete('/:id', [authJwt.verifyToken], controller.deleteContact)

module.exports = router;