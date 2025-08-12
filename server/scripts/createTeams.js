const mongoose = require("mongoose");
const Team = require("../models/Team");
const Hackathon = require("../models/Hackathon");
const User = require("../models/User");

const MONGO_URI = "mongodb://localhost:27017/devmate"; 

const teamNames = ["Alpha Coders", "Byte Ninjas", "Debug Lords", "Code Crusaders", "Stack Smashers", "Pixel Pushers"];
const techStacks = [["React", "Node.js"], ["Vue", "Firebase"], ["Angular", "Express"], ["Python", "Flask", "PostgreSQL"]];
const roles = ["Frontend", "Backend", "UI/UX", "DevOps", "QA", "PM"];
const ideas = ["AI assistant for devs", "Hackathon matcher", "Realtime chat app", "Bug tracker", "Portfolio builder"];
const workModes = ["online", "offline", "hybrid"];

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createTeamsForHackathons() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const hackathons = await Hackathon.find();
    const users = await User.find();

    if (hackathons.length === 0 || users.length < 3) {
      throw new Error("Not enough data: Need at least 1 hackathon and 3 users.");
    }

    let totalTeamsCreated = 0;

    for (const hackathon of hackathons) {
      const numTeams = getRandomInt(2, 3);
      const usedCreators = new Set();

      for (let i = 0; i < numTeams; i++) {
        let creator;
        let attempts = 0;

        // Ensure unique creators per hackathon
        do {
          creator = users[getRandomInt(0, users.length - 1)];
          attempts++;
        } while (usedCreators.has(creator._id.toString()) && attempts < 10);

        usedCreators.add(creator._id.toString());

        const team = new Team({
          hackathonId: hackathon._id,
          name: `${teamNames[getRandomInt(0, teamNames.length - 1)]} ${Math.floor(Math.random() * 1000)}`,
          description: "Auto-generated team for testing",
          techStack: getRandomElements(techStacks[getRandomInt(0, techStacks.length - 1)], getRandomInt(2, 3)),
          maxSize: getRandomInt(3, 6),
          creator: creator._id,
          members: [creator._id],
          lookingForRoles: getRandomElements(roles, getRandomInt(2, 3)),
          projectIdea: ideas[getRandomInt(0, ideas.length - 1)],
          workMode: workModes[getRandomInt(0, workModes.length - 1)],
          joinRequests: [],
        });

        await team.save();

        // Optional: update creator’s teamsCreated
        creator.teamsCreated.push(team._id);
        await creator.save();

        totalTeamsCreated++;
        console.log(`Created team "${team.name}" in hackathon "${hackathon.title}" by ${creator.name}`);
      }
    }

    console.log(`🎉 Successfully created ${totalTeamsCreated} teams under ${hackathons.length} hackathons.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err.message);
    await mongoose.disconnect();
  }
}

createTeamsForHackathons();
