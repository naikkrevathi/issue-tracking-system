// Creates demo Admin and User accounts. Run: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const accounts = [
  { name: "Admin", email: "admin@example.com", password: "Admin@123", role: "ADMIN" },
  { name: "Demo User", email: "user@example.com", password: "User@123", role: "USER" },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const a of accounts) {
    const password = await bcrypt.hash(a.password, 10);
    await User.findOneAndUpdate({ email: a.email }, { ...a, password }, { upsert: true });
    console.log(`Seeded ${a.role}: ${a.email}`);
  }
  await mongoose.disconnect();
})();
