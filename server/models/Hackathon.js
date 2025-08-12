const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    url: { type: String, required: true, unique: true },
    deadline: { type: String },
    location: { type: String },
    visibility: { type: String },
    host: { type: String },
    eligibility: { type: [String], default: [] },
    participants: { type: String, default: "N/A" },
    prize: { type: String, default: "N/A" },
    themes: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Hackathon", hackathonSchema);
