const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    label: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    lead: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },
    paymentDate: {
        required: true,
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema)