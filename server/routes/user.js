// routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/:userId/full — Get full public profile + created teams
router.get('/:userId/full', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password') // exclude password
      .populate({
        path: 'teamsCreated',
        populate: [
          { path: 'members', select: 'name email' },
          { path: 'hackathonId', select: 'title subtitle' },
        ],
      });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
