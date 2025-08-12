// 📁 routes/suggestions.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/projects/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(`http://localhost:8000/suggest/projects/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Suggestion fetch failed", error.message);
    res.status(500).json({ error: "Suggestion engine unavailable" });
  }
});

router.get('/hackathons/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(`http://localhost:8000/suggest/hackathons/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Suggestion fetch failed", error.message);
    res.status(500).json({ error: "Suggestion engine unavailable" });
  }
});

module.exports = router;
