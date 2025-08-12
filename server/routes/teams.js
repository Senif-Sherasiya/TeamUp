const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Team = require("../models/Team");
const Hackathon = require("../models/Hackathon");
const User = require("../models/User");

router.post("/hackathon/:id", auth, async (req, res) => {
  const {
    name,
    description,
    techStack,
    maxSize,
    lookingForRoles = [],
    projectIdea = "",
    workMode = ""
  } = req.body;

  const hackathonId = req.params.id;

  try {
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

    const team = await Team.create({
      hackathonId,
      name,
      description,
      techStack,
      maxSize,
      creator: req.user._id,
      members: [req.user._id],
      lookingForRoles,
      projectIdea,
      workMode,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { teamsCreated: team._id }
    });

    res.status(201).json(team);
  } catch (err) {
    console.error("Team creation error:", err);
    res.status(500).json({ error: "Failed to create team" });
  }
});

router.get("/hackathon/:id", auth, async (req, res) => {
  try {
    const teams = await Team.find({ hackathonId: req.params.id })
      .populate("creator", "name email")
      .populate("members", "name email")
      .populate("joinRequests", "name email");

    const userIdStr = req.user._id.toString();

    const userTeam = teams.find((team) =>
      team.members.some((member) => member._id.toString() === userIdStr)
    );

    const joinRequestedTeamIds = teams
      .filter(team =>
        team.joinRequests.some(request => request._id.toString() === userIdStr)
      )
      .map(t => t._id.toString());

    res.json({
      teams,
      userTeam,
      joinRequestedTeamIds,
    });
  } catch (err) {
    console.error("Fetch teams error:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.post("/:teamId/join", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const userId = req.user._id.toString();
    if (team.members.map(id => id.toString()).includes(userId))
      return res.status(400).json({ error: "Already a member" });

    if (team.joinRequests.map(id => id.toString()).includes(userId))
      return res.status(400).json({ error: "Already requested" });

    team.joinRequests.push(req.user._id);
    await team.save();

    res.json({ message: "Join request sent" });
  } catch (err) {
    console.error("Join request error:", err);
    res.status(500).json({ error: "Failed to send join request" });
  }
});

router.post("/:teamId/accept", auth, async (req, res) => {
  const { userId } = req.body;
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (!team.creator.equals(req.user._id)) return res.status(403).json({ error: "Only creator can accept requests" });
    if (team.members.length >= team.maxSize) return res.status(400).json({ error: "Team is full" });

    team.members.push(userId);
    team.joinRequests = team.joinRequests.filter(id => id.toString() !== userId);
    await team.save();

    res.json({ message: "User added to team" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept user" });
  }
});

router.post("/:teamId/reject", auth, async (req, res) => {
  const { userId } = req.body;
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (!team.creator.equals(req.user._id)) return res.status(403).json({ error: "Only creator can reject requests" });

    team.joinRequests = team.joinRequests.filter(id => id.toString() !== userId);
    await team.save();

    res.json({ message: "Join request rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject user" });
  }
});

router.post("/:teamId/remove", auth, async (req, res) => {
  const { userId } = req.body;
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (!team.creator.equals(req.user._id)) return res.status(403).json({ error: "Only creator can remove members" });

    team.members = team.members.filter(id => id.toString() !== userId);
    await team.save();

    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove member" });
  }
});

router.post("/:teamId/leave", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    if (team.creator.equals(req.user._id)) return res.status(403).json({ error: "Creator cannot leave team" });

    team.members = team.members.filter(id => id.toString() !== req.user._id.toString());
    await team.save();

    res.json({ message: "You left the team" });
  } catch (err) {
    res.status(500).json({ error: "Failed to leave team" });
  }
});



router.get('/my-teams', auth, async (req, res) => {
  try {
    const myTeams = await Team.find({
      $or: [
        { creator: req.user._id },
        { members: req.user._id }
      ]
    })
      .populate('hackathonId')
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .populate('joinRequests', 'name email');

    res.json(myTeams);
  } catch (err) {
    console.error("Error fetching user teams:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
