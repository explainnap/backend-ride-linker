// import mongoose from "mongoose";

const mongoose = require ("mongoose")

const rideSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    text:{
        type: String,
        required: true
    },
    distance:{
        type: String,
        required: true
    }
})

const Ride = new mongoose.model('Ride', rideSchema)



module.exports = Ride