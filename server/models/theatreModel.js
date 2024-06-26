const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    isActive:{
        type:Boolean,
        required:true,
        default:false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdetails"
      },
})

module.exports = mongoose.model("theatres", theatreSchema)