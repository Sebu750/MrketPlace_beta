/**
 * Seed script — creates demo accounts for testing
 * Run:  node src/seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Clear previous demo accounts
  await User.deleteMany({ email: { $in: ["admin@adorzia.com", "customer@demo.com", "designer@demo.com"] } });

  const accounts = [
    { name: "Adorzia Admin",  email: "admin@adorzia.com",  password: "admin12345",  role: "admin"  },
    { name: "Ayesha Khan",    email: "customer@demo.com",  password: "password123", role: "buyer"  },
    { name: "Zara Ahmad",     email: "designer@demo.com",  password: "password123", role: "seller" },
  ];

  for (const acct of accounts) {
    const user = await User.create(acct);
    console.log(`  ✓ ${user.role.padEnd(6)} → ${user.email}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
};

seed().catch((err) => { console.error(err); process.exit(1); });
