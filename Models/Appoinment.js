const mongoose = require ("mongoose");


const appoinmentSchema = new mongoose.Schema({
    visitor : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Visitor",
        required : true
    },
    host:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",   
        required : true
     },
     date : {
        type : Date,
        required : true
     },
     time:{
        type : String,
        required : true
     },
     purpose:{
        type : String,
        required : true
     },
     status : {
        type : String,
        enum : ["pending" , "approved" , "rejected", "completed"],
        default : "pending"
        },
     notes: {
        type : String   
     }  
}, {timestamps: true});

module.exports = mongoose.model("Appoinment", appoinmentSchema)