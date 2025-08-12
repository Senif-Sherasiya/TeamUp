const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  rolesNeeded: [{ type: String }],
  github: { type: String },
  maxMembers: { type: Number, default: 5 },
  teamMembers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      requestedAt: { type: Date, default: Date.now },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);