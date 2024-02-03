const express = require('express');
const controller = require("../../controllers/recipe");
const { authJwt } = require("../../middlewares");

const router = express.Router()

//Post Method
router.post('/', [authJwt.verifyToken], controller.addRecipe)

//Get all Method
router.get('/', [authJwt.verifyToken], controller.getAllRecipes)

//Get by ID Method
router.get('/:id', [authJwt.verifyToken], controller.getRecipeById)

//Update by ID Method
router.put('/:id', [authJwt.verifyToken], controller.updateRecipe)

//Delete by ID Method
router.delete('/:id', [authJwt.verifyToken], controller.deleteRecipe)

module.exports = router;