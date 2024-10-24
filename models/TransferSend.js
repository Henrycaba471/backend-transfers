const { Schema, model } = require('mongoose');

const SendSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fact:{
        type: Number,
        default: () => Math.round(Math.random() * 99999999)
    },
    bankEntity: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: null,
    },
    account: {
        type: String,
        required: true
    },
    nameClient: {
        type: String,
        default: null
    },
    documentClient: {
        type: Number,
        required: true
    },
    cashBs:{
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model("Send", SendSchema, "sends");