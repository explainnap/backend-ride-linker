// import express from 'express'
const express = require ("express")
// import Group from '../models/group.js'
const Group = require ("../models/group.js")
// import Ride from '../models/ride.js';
const Ride = require ("../models/ride.js")
// import verifyToken from '../middleware/verifyToken.js';
const verifyToken = require ('../middleware/verify-token.js')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find({})
        res.status(200).json(groups)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:groupId', async (req,res) => {
    try {
        const group = await Group.findById(req.params.groupId).populate('rides')
        res.status(200).json(group)
    } catch (error) {
        res.status(500)
        console.log(error)
    }
})

router.post('/add', verifyToken, async (req, res) => {
    try {
        const { owner, name, description } = req.body;

        // Validate required fields
        if (!owner || !name || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check for duplicate group name
        const repeatedGroup = await Group.findOne({ name });
        if (repeatedGroup) {
            return res
                .status(412)
                .json({ message: "This Group name already exists." });
        }

        // Create and save the new group
        const addedGroup = await Group.create({ owner, name, department, description });

        // Send success response
        return res.status(200).json(addedGroup);
    } catch (error) {
        console.error('Error adding group:', error); // Log the error for debugging
        return res.status(500).json({ message: "Please try again later." });
    }
});

router.post('/:groupId/add', verifyToken, async (req,res) => {
    try {
        const { name, text } = req.body
        const group = req.params.groupId
        console.log(name, text, group)

        if (!name || !text || !group){
            return res.status(400).json({ message: 'All fields are required' })
        }

        const addedRide = await Ride.create({ name, text, group })
        const rideGroup = await Group.findById(group)
        rideGroup.rides.push(addedRide._id)
        await rideGroup.save()
        console.log(rideGroup)
        return res.status(200).json(addedRide);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error. Please try again later." })
    }
})


module.exports = router