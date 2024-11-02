const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    image: {
        type: String,
        default: "usuario.png"
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    documento: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: 'El Tarra'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model("User", UserSchema, "users");