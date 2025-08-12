const mongoose = require("mongoose");
const User = require("../models/User"); 
const Project = require("../models/Project");

const MONGO_URI = "mongodb://localhost:27017/devmate";

const titles = [
  "Rent N Ride", "Taskify", "CodeBuddy", "DevMate AI", "Foodify", "HealthTrack",
  "CareerConnect", "TravelMate", "InstaClone", "ShopSmart", "GreenSteps", "SmartCart",
  "StudySync", "QuizUp", "SkillBridge", "PortfolioPro", "BugTracker", "JobRadar"
];

const descriptions = [
  "A platform to connect developers.", "An AI tool to track habits.", "A website to rent bikes and cars.",
  "A social media clone for devs.", "A SaaS for smart shopping.", "An app to manage personal health.",
  "A platform for remote jobs.", "A website for collaborative learning.", "A hackathon team matcher.",
  "A smart grocery assistant.", "A freelance project board for devs.", "Online exam and quiz system."
];

const techStacks = [
  ["React", "Node.js", "MongoDB"], ["Next.js", "PostgreSQL"], ["Python", "Flask", "MySQL"],
  ["React Native", "Firebase"], ["Vue", "Express"], ["Django", "SQLite"],
  ["MERN"], ["Tailwind", "Supabase"], ["FastAPI", "Redis"], ["Svelte", "Node.js"]
];

const roles = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "UI/UX Designer", "Data Scientist", "ML Engineer", "DevOps", "Project Manager"
];

const getRandomFromArray = (arr, count = 1) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const createProjects = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({});
    if (!users.length) {
      console.log("No users found in DB.");
      return;
    }

    const allProjects = [];

    for (const user of users) {
      const projectCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 projects
      for (let i = 0; i < projectCount; i++) {
        const title = getRandomFromArray(titles)[0];
        const description = getRandomFromArray(descriptions)[0];
        const techStack = getRandomFromArray(techStacks)[0];
        const rolesNeeded = getRandomFromArray(roles, Math.floor(Math.random() * 3) + 1); // 1-3 roles

        allProjects.push({
          title,
          description,
          techStack,
          rolesNeeded,
          github: "",
          maxMembers: Math.floor(Math.random() * 3) + 3, // 3 to 5
          createdBy: user._id,
          teamMembers: [{ user: user._id }],
          joinRequests: [],
        });
      }
    }

    await Project.insertMany(allProjects);
    console.log(`Inserted ${allProjects.length} projects successfully.`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("Error creating projects:", err);
    await mongoose.disconnect();
  }
};

createProjects();
