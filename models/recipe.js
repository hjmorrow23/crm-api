const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    ingredients: [
        {
            name: String,
            quantity: String,
            quantityType: String
        },
    ],
    steps: [
        {
            order: Number,
            text: String
        }
    ],
    tags: [String],
    image: String,
    // tags: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Tag"
    //     }
    // ]

});

module.exports = mongoose.model('Recipe', recipeSchema)