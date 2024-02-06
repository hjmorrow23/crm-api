const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    phone: {
        required: false,
        type: String
    },
    title: {
        required: false,
        type: String
    },
    company: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
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
    isPrimaryContact: {
        required: true,
        type: Boolean
    },
    primaryContactLeadId: [{
        required: false,
        type: String
    }],
});

module.exports = mongoose.model('Contact', contactSchema)