const mongoose = require ("mongoose");

const visitorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    photo : {
        type : String,
    },
    idProof : {
        type : String
    },
    purpose : {
        type : String,
        required : true
    },
    host : {
        type: String,
        required: true
    },
    status : {
        type : String,
           enum: ["pending", "approved", "rejected","checked-in", "checked-out"],
         default: "pending",
    },
    rejectionReason: {
        type: String,
        default: ""
    },
    phone: {
        type: String
    }
}, {timestamps : true});

module.exports = mongoose.model("Visitor", visitorSchema)