const express = require("express");
const Group = require("../models/group.js");
const Ride = require("../models/ride.js");
const verifyToken = require("../middleware/verify-token.js");

const router = express.Router();

// Get all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find({});
        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching groups." });
    }
});

// Get single group by ID and fetch its rides
router.get('/:groupId', async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found." });
        }

        const rides = await Ride.find({ group: req.params.groupId });
        res.status(200).json({ ...group.toObject(), rides });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching group." });
    }
});

// Add new group
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { owner, name, description, distance, users, routes } = req.body;

        if (!owner || !name || !description) {
            return res.status(400).json({ message: "Owner, name, and description are required." });
        }

        const repeatedGroup = await Group.findOne({ name });
        if (repeatedGroup) {
            return res.status(412).json({ message: "This Group name already exists." });
        }

        const addedGroup = await Group.create({
            owner,
            name,
            description,
            distance,
            users,
            routes
        });

        res.status(200).json(addedGroup);
    } catch (error) {
        console.error('Error adding group:', error);
        res.status(500).json({ message: "Server error adding group." });
    }
});

// Add new ride to a group
router.post('/:groupId/add', verifyToken, async (req, res) => {
    try {
        const { name, distanceSpeed, isComplete } = req.body;
        const group = req.params.groupId;

        if (!name || !distanceSpeed || typeof isComplete === "undefined") {
            return res.status(400).json({ message: 'Name, distance/speed, and completion status are required.' });
        }

        const addedRide = await Ride.create({ name, group, distanceSpeed, isComplete });

        res.status(200).json(addedRide);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error adding ride." });
    }
});

module.exports = router;
