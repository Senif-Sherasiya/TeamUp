const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackathon");

// GET all hackathons
router.get("/", async (req, res) => {
    try {
        const hackathons = await Hackathon.find().sort({ deadline: 1 });
        res.json(hackathons);
    } catch (err) {
        console.error("Error fetching hackathons:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/hackathons/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hackathon = await Hackathon.findById(id);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });
    res.json(hackathon);
  } catch (err) {
    console.error("Error fetching hackathon by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
