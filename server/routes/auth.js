const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function respond(res, user, status = 200) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(status).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

// Public registration always creates a normal USER. Admins are created via the seed script.
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: "Email is already registered" });
  }
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: "USER" });
  respond(res, user, 201);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = email && (await User.findOne({ email: email.toLowerCase() }));
  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  respond(res, user);
});

router.get("/me", requireAuth, (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ user: { id: _id, name, email, role } });
});

module.exports = router;
