const express = require('express');
const controller = require("../../controllers/payment");
const { authJwt } = require("../../middlewares");

const router = express.Router()

//Post Method
router.post('/', [authJwt.verifyToken], controller.addPayment)

//Get all Method
router.get('/', [authJwt.verifyToken], controller.getAllPayments)

//Get by ID Method
router.get('/:id', [authJwt.verifyToken], controller.getPaymentById)

//Get payments on a lead Method
router.get('/:leadId', [authJwt.verifyToken], controller.getPaymentsOnALead)

//Update by ID Method
router.put('/:id', [authJwt.verifyToken], controller.updatePayment)

//Delete by ID Method
router.delete('/:id', [authJwt.verifyToken], controller.deletePayment)

module.exports = router;