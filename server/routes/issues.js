const express = require("express");
const Issue = require("../models/Issue");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const STATUSES = ["Open", "In Progress", "Closed"];

function populate(query) {
  return query.populate("createdBy", "name email").populate("assignedTo", "name email");
}

// Only the creator or an admin may edit/delete an issue.
function canModify(user, issue) {
  return user.role === "ADMIN" || issue.createdBy.toString() === user._id.toString();
}

async function loadIssue(req, res, next) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    req.issue = issue;
    next();
  } catch {
    res.status(404).json({ message: "Issue not found" });
  }
}

// List issues. Optional filters: ?status=Open&assigned=me
router.get("/", async (req, res) => {
  const filter = {};
  if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (req.query.assigned === "me") filter.assignedTo = req.user._id;
  const issues = await populate(Issue.find(filter).sort({ createdAt: -1 }));
  res.json(issues);
});

router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title and description are required" });
  const issue = await Issue.create({ title, description, createdBy: req.user._id });
  res.status(201).json(await populate(Issue.findById(issue._id)));
});

router.get("/:id", loadIssue, async (req, res) => {
  res.json(await populate(Issue.findById(req.issue._id)));
});

router.put("/:id", loadIssue, async (req, res) => {
  if (!canModify(req.user, req.issue)) return res.status(403).json({ message: "You can only edit your own issues" });
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Title and description are required" });
  req.issue.title = title;
  req.issue.description = description;
  await req.issue.save();
  res.json(await populate(Issue.findById(req.issue._id)));
});

router.delete("/:id", loadIssue, async (req, res) => {
  if (!canModify(req.user, req.issue)) return res.status(403).json({ message: "You can only delete your own issues" });
  await Comment.deleteMany({ issue: req.issue._id });
  await req.issue.deleteOne();
  res.json({ message: "Issue deleted" });
});

router.patch("/:id/status", loadIssue, async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  req.issue.status = req.body.status;
  await req.issue.save();
  res.json(await populate(Issue.findById(req.issue._id)));
});

// Send assignedTo: null (or "") to unassign.
router.patch("/:id/assign", loadIssue, async (req, res) => {
  const { assignedTo } = req.body;
  if (assignedTo) {
    const exists = await User.exists({ _id: assignedTo }).catch(() => null);
    if (!exists) return res.status(400).json({ message: "User not found" });
  }
  req.issue.assignedTo = assignedTo || null;
  await req.issue.save();
  res.json(await populate(Issue.findById(req.issue._id)));
});

router.get("/:id/comments", loadIssue, async (req, res) => {
  const comments = await Comment.find({ issue: req.issue._id }).sort({ createdAt: 1 }).populate("author", "name");
  res.json(comments);
});

router.post("/:id/comments", loadIssue, async (req, res) => {
  if (!req.body.text || !req.body.text.trim()) return res.status(400).json({ message: "Comment cannot be empty" });
  const comment = await Comment.create({ issue: req.issue._id, author: req.user._id, text: req.body.text });
  res.status(201).json(await comment.populate("author", "name"));
});

module.exports = router;
