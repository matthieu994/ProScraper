const mongoose = require("mongoose")

const Schema = mongoose.Schema

module.exports = new Schema({
    name: {
        type: String,
        required: "Enter a name"
    },
    date: {
        type: Date,
        default: Date.now
    },
    selector: {
        type: String,
        required: "Enter a selector"
    },
    count: {
        type: Number,
        default: 0
    },
    result: {
        type: String,
        default: "N/A"
    }
})
