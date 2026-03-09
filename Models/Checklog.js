const mongoose = require ("mongoose");

const checkLogSchema = new mongoose.Schema({
    visitor: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Visitor",
        required : true
    },

    pass : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Pass",
        required : true
    },
    checkInTime : {
        type : Date,

    },
    checkOutTime : {
        type : Date,
    },
    scannedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",

    },
    status : {
        type : String,
        enum : ["checked-in", "checked-out"],
        default : "checked-in"
    },
}, {timestamps : true});

module.exports = mongoose.model("CheckLog", checkLogSchema)