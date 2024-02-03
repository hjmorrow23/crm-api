const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    password: {
        required: true,
        type: String
    }

});

module.exports = mongoose.model('User', userSchema)