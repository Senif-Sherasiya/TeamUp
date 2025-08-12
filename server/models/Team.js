const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
    name: { type: String, required: true },
    description: String,
    techStack: [String],
    maxSize: { type: Number, required: true, min: 2 },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lookingForRoles: [String],
    projectIdea: { type: String },
    workMode: {
        type: String,
        enum: ["online", "offline", "hybrid"],
    },
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
