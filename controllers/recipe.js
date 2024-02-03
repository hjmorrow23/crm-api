const db = require("../models");
const Recipe = db.recipe;
exports.addRecipe = async (req, res) => {
    const recipe = new Recipe({
        name: req.body.name,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        image: req.body.image,
        tags: req.body.tags
    })
    try {
        await recipe.save();
        res.status(200).json({ recipeId: recipe._id });
    } catch(err) {
        res.status(400).json({message: err.message})
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes =  await Recipe.find({});
        res.status(200).json(recipes);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.status(200).json(recipe);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
    
}

exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        Object.assign(recipe, req.body).save();
        res.status(204).json(recipe);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}

exports.deleteRecipe = async (req, res) => {
    try {
        await Recipe.remove({_id : req.params.id});
        res.status(204).json({ message: "Recipe successfully deleted!"})
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
}