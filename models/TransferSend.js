const { Schema, model } = require('mongoose');
const moment = require('moment-timezone');

const colombiaDate = moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");

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
        type: String,
        default: colombiaDate
    }
});

module.exports = model("Send", SendSchema, "sends");