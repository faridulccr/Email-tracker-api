const mongoose = require("mongoose");

// to create a structure of database's record/document
const recipientSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    statusTime: {
        type: String,
        required: true,
    },
    sentTime: {
        type: String,
        required: true,
    },
    recipient: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

// to create a Recipient Schema for collection of documents
const Recipient = mongoose.model("Recipient", recipientSchema); // returns a constructor object
module.exports = Recipient;
