const express = require("express");
const Issue = require("../models/Issue");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Dashboard counts. Admins additionally get totalUsers.
router.get("/dashboard", async (req, res) => {
  const [total, open, inProgress, closed, assignedToMe] = await Promise.all([
    Issue.countDocuments(),
    Issue.countDocuments({ status: "Open" }),
    Issue.countDocuments({ status: "In Progress" }),
    Issue.countDocuments({ status: "Closed" }),
    Issue.countDocuments({ assignedTo: req.user._id }),
  ]);
  const stats = { total, open, inProgress, closed, assignedToMe };
  if (req.user.role === "ADMIN") stats.totalUsers = await User.countDocuments();
  res.json(stats);
});

// Everyone needs the user list to assign issues; only admins see email/role/date details.
router.get("/users", async (req, res) => {
  const fields = req.user.role === "ADMIN" ? "name email role createdAt" : "name";
  res.json(await User.find().select(fields).sort({ name: 1 }));
});

module.exports = router;
