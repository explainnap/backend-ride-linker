// import mongoose from "mongoose";
const mongoose = require ("mongoose")

const groupSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: true
    },
    distance:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rides:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
    }]
})

const Group = new mongoose.model('Group', groupSchema)


module.exports = Group