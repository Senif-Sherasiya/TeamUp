const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// POST /api/projects
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, techStack, rolesNeeded, github, maxMembers } = req.body;
  try {
    const project = await Project.create({
      title,
      description,
      techStack,
      rolesNeeded,
      github,
      maxMembers,
      createdBy: req.user.id,
      teamMembers: [{ user: req.user.id }],
    });
    res.status(201).json(project);
  } catch (err) {
    console.error("Project creation failed", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});


// joinig a project
router.post("/:id/join", authMiddleware, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  if (project.team.includes(req.user.id))
    return res.status(400).json({ error: "Already a member" });

  if (project.team.length >= project.maxMembers)
    return res.status(400).json({ error: "Team is full" });

  project.team.push(req.user.id);
  await project.save();
  await project.populate("team", "name"); // optional for names
  res.json(project);
});


// GET /api/projects — fetch all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("teamMembers.user", "name")
      .populate("joinRequests.user", "name");

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("teamMembers.user", "name email")
      .populate("joinRequests.user", "name email");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST /api/projects/:id/join-request
router.post("/:id/join-request", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    // Check if already a member
    const isMember = project.teamMembers.some(
      (tm) => tm.user.toString() === req.user._id.toString()
    );
    if (isMember) return res.status(400).json({ error: "You're already a member" });

    // Check if already requested
    const alreadyRequested = project.joinRequests.some(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyRequested) return res.status(400).json({ error: "Already requested" });

    // Add request
    project.joinRequests.push({ user: req.user._id });
    await project.save();

    res.json({ message: "Join request sent" });
  } catch (err) {
    console.error("Join request error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/projects/:id/requests
router.get("/:id/requests", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("joinRequests.user", "name email");

    if (!project) return res.status(404).json({ error: "Project not found" });
    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    res.json(project.joinRequests);
  } catch (err) {
    console.error("Error getting requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/projects/:id/requests/:userId
router.post("/:id/requests/:userId", authMiddleware, async (req, res) => {
  const { action } = req.body; // "accept" or "reject"
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    if (action === "accept") {
      const alreadyMember = project.teamMembers.some(
        (tm) => tm.user.toString() === req.params.userId
      );
      if (alreadyMember) return res.status(400).json({ error: "User already in team" });

      if (project.teamMembers.length >= project.maxMembers)
        return res.status(400).json({ error: "Team is full" });

      project.teamMembers.push({ user: req.params.userId });
    }

    // Remove from requests (common to both actions)
    project.joinRequests = project.joinRequests.filter(
      (r) => r.user.toString() !== req.params.userId
    );

    await project.save();
    res.json({ message: `Request ${action}ed successfully` });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
