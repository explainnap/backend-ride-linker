const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const User = require("../models/user.js");
const Group = require("../models/group.js");
const Ride = require("../models/ride.js");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groupFilePath = path.resolve(__dirname, './groupData.json');

const saltRounds = 12;

const seedDatabase = async () => {
  try {
    console.log('🚀 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const groupData = JSON.parse(fs.readFileSync(groupFilePath, 'utf-8'));

    // Clean existing data
    await User.deleteMany();
    await Group.deleteMany();
    await Ride.deleteMany();
    console.log('🧹 Cleared existing data');

    // Step 1: Seed Users (with hashed passwords!)
    const users = await User.insertMany([
      {
        username: "testuser",
        hashedPassword: bcrypt.hashSync("test123", saltRounds),
      },
      {
        username: "alice",
        hashedPassword: bcrypt.hashSync("password", saltRounds),
      },
    ]);
    const userIds = users.map(user => user._id);
    console.log(` Seeded ${users.length} users`);

    // Step 2: Seed Groups and Rides
    for (const group of groupData) {
      const newGroup = await Group.create({
        name: group.name,
        description: group.description,
        distance: group.distance,
        users: userIds.slice(0, 2), // assign first two users to each group
      });

      const rides = await Ride.insertMany(
        group.rides.map(ride => ({
          name: ride.name,
          group: newGroup._id,
          distance: ride.distance,
          text: ride.text,
          isComplete: ride.isComplete
        }))
      );

      console.log(` Created group: ${newGroup.name} with ${rides.length} rides`);
    }

    console.log('🎉 Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error(' Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
