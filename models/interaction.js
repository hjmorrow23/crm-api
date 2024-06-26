const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    label: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    contact: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    },
    lead: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema)