const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    addressLine1: {
        required: false,
        type: String
    },
    addressLine2: {
        required: false,
        type: String
    },
    city: {
        required: false,
        type: String
    },
    state: {
        required: false,
        type: String
    },
    zip: {
        required: false,
        type: Number
    },
    email: {
        required: false,
        type: String
    },
    phone: {
        required: false,
        type: String
    },
    primaryContact: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact"
        }
    ],
    interactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interaction"
        }
    ],
});

module.exports = mongoose.model('Lead', leadSchema)