const mongoose  = require ("mongoose");

const passSchema = new mongoose.Schema({
    visitor: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Visitor",
        required : true
    },

    appoinment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Appointment",
        required : false
    },
    passCode : {
        type : String,
        required : true,
        unique : true
    },

    qrCodeImages : {
        type : String

    },
    validFrom :{
        type : Date,
        required : true
    },
    validTo : {
        type : Date,
        required : true
    },
    isUsed:{
        type: Boolean,
        default : false
    },
    issuedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

}, {timestamps : true});

module.exports = mongoose.model("Pass", passSchema)