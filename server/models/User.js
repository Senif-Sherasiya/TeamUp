// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    default: "",
  },

  skills: {
    type: [String],
    default: [],
  },

  github: {
    type: String,
    default: "",
  },

  linkedin: {
    type: String,
    default: "",
  },

  teamsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
