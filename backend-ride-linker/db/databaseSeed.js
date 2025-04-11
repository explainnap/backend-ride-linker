const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');
const Group = require('../models/group.js');
const Ride = require('../models/ride.js');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const groupFilePath = path.resolve(__dirname, './groupData.json');

const seedDatabase = async () => {
  try {
    console.log('🚀 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const groupData = JSON.parse(fs.readFileSync(groupFilePath, 'utf-8'));

    // Clean existing data
    await Promise.all([
      User.deleteMany(),
      Group.deleteMany(),
      Ride.deleteMany()
    ]);
    console.log('🧹 Cleared existing data');

    // Step 1: Seed Users with hashed passwords
    const plainUsers = ['alice', 'bob', 'charlie', 'dana', 'evan'];
    const users = await Promise.all(
      plainUsers.map(async (username, idx) => {
        const hashedPassword = await bcrypt.hash(`password${idx + 1}`, 10);
        return { username, hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Seeded ${createdUsers.length} users`);

    // Step 2: Seed Groups and Rides
    for (const group of groupData) {
      // Create the group first
      const newGroup = await Group.create({
        name: group.name,
        description: group.description,
        distance: group.distance,
        users: createdUsers.slice(0, 2).map(u => u._id) // assign first 2 users
      });

      // Create rides for this group
      const rides = await Ride.insertMany(
        group.rides.map(ride => ({
          name: ride.name,
          group: newGroup._id,
          distance: ride.distance,
          text: ride.text,
          isComplete: ride.isComplete
        }))
      );

      // Link rides back to group (populate-ready!)
      newGroup.rides = rides.map(ride => ride._id);
      await newGroup.save();

      console.log(`✅ Created group: ${newGroup.name} with ${rides.length} rides`);
    }

    console.log('🎉 Database seeded successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
