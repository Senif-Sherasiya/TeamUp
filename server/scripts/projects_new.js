const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");

const MONGO_URI = "mongodb://localhost:27017/devmate";

// Curated project templates: title + description + tech stack
const projectTemplates = [
  {
    title: "Rent N Ride",
    description: "A platform to rent and share bikes and cars using real-time location and smart pricing.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "DevMate AI",
    description: "An AI-powered assistant to match developers with projects based on skills and interest.",
    techStack: ["Next.js", "FastAPI", "PostgreSQL"]
  },
  {
    title: "CodeBuddy",
    description: "A platform to find coding partners and collaborate on challenges and mini-projects.",
    techStack: ["Vue", "Firebase"]
  },
  {
    title: "Foodify",
    description: "A smart food ordering app with recommendations based on taste and dietary preferences.",
    techStack: ["React Native", "Node.js", "MongoDB"]
  },
  {
    title: "StudySync",
    description: "A collaborative study platform for students to form groups and share resources.",
    techStack: ["Django", "SQLite"]
  },
  {
    title: "HealthTrack",
    description: "An app to track fitness and health vitals with smart alerts and doctor connect.",
    techStack: ["Flutter", "Firebase"]
  },
  {
    title: "CareerConnect",
    description: "A portal for students to find internships and jobs tailored to their interests.",
    techStack: ["MERN"]
  },
  {
    title: "ShopSmart",
    description: "An AI-driven shopping assistant that recommends products based on budget and taste.",
    techStack: ["Next.js", "Supabase"]
  },
  {
    title: "InstaClone",
    description: "A social media platform to share moments with photo filters and real-time chat.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "SkillBridge",
    description: "A skill-based networking platform for students to exchange mentorship and gigs.",
    techStack: ["Svelte", "Express", "MySQL"]
  },
  {
    title: "BugTracker",
    description: "An issue tracking and project management tool for dev teams.",
    techStack: ["Angular", "Node.js", "MongoDB"]
  },
  {
    title: "TravelMate",
    description: "A travel planner with itinerary builder, weather alerts, and bookings.",
    techStack: ["Vue", "Express", "MongoDB"]
  },
  {
    title: "QuizUp",
    description: "An online quiz and learning platform with real-time multiplayer mode.",
    techStack: ["React", "Firebase"]
  },
  {
    title: "JobRadar",
    description: "A job aggregation and alert system for tech roles in startups and MNCs.",
    techStack: ["Flask", "MongoDB"]
  },
  {
    title: "PortfolioPro",
    description: "A portfolio builder for developers with real-time updates and GitHub integration.",
    techStack: ["Next.js", "MongoDB"]
  },
  {
    title: "GreenSteps",
    description: "A gamified carbon footprint tracker that encourages eco-friendly choices.",
    techStack: ["React Native", "Firebase"]
  },
  {
    title: "Taskify",
    description: "A task management and productivity tracker app with Pomodoro technique.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "FreelanceBoard",
    description: "A platform for developers to find freelance gigs and post services.",
    techStack: ["Laravel", "MySQL"]
  },
  {
    title: "HackTeam",
    description: "A hackathon team finder and project collaboration tool.",
    techStack: ["MERN"]
  },
  {
    title: "NoteShare",
    description: "An app to share and organize study notes with tagging and versioning.",
    techStack: ["Django", "PostgreSQL"]
  },
  {
    title: "EventHive",
    description: "A platform to discover, join, and organize events and workshops.",
    techStack: ["Vue", "Express", "MongoDB"]
  },
  {
    title: "PetPal",
    description: "A platform to adopt pets, find shelters, and connect with pet lovers.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "FinGuard",
    description: "A personal finance and budgeting assistant with ML-based savings insights.",
    techStack: ["React", "Flask", "PostgreSQL"]
  },
  {
    title: "EduMentor",
    description: "A mentorship platform for students to find and connect with professionals.",
    techStack: ["Next.js", "MongoDB"]
  },
  {
    title: "LangBuddy",
    description: "An AI-driven language learning app with speech recognition and quizzes.",
    techStack: ["Flutter", "FastAPI", "MongoDB"]
  },
  {
    title: "CryptoWatch",
    description: "A real-time crypto price tracker and portfolio management tool.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "VoteChain",
    description: "A secure blockchain-based voting system for organizations.",
    techStack: ["Solidity", "React", "Ethereum"]
  },
  {
    title: "HomeHarvest",
    description: "An IoT-based home gardening assistant with smart water scheduling.",
    techStack: ["Raspberry Pi", "Flask", "MongoDB"]
  },
  {
    title: "MindSpace",
    description: "A mental health tracker and AI chatbot for therapy support.",
    techStack: ["Next.js", "Node.js", "MongoDB"]
  },
  {
    title: "ArtShare",
    description: "A platform for artists to upload, sell, and share digital art.",
    techStack: ["Vue", "Firebase"]
  },
  {
    title: "BudgetBuddy",
    description: "A collaborative expense tracking and group budgeting app.",
    techStack: ["React Native", "Supabase"]
  },
  {
    title: "NewsPulse",
    description: "A news aggregator that curates headlines using NLP and sentiment.",
    techStack: ["React", "Flask", "MongoDB"]
  },
  {
    title: "BookSwap",
    description: "A book exchange and recommendation platform for students.",
    techStack: ["Vue", "Node.js", "MongoDB"]
  },
  {
    title: "WasteLess",
    description: "A food waste management app connecting donors with NGOs.",
    techStack: ["React Native", "Firebase"]
  },
  {
    title: "EcoCart",
    description: "A sustainable shopping platform that shows eco scores of products.",
    techStack: ["Next.js", "MongoDB"]
  },
  {
    title: "FitTrack",
    description: "A fitness tracker and personalized workout planner with ML.",
    techStack: ["Flutter", "Node.js", "MongoDB"]
  },
  {
    title: "WeatherIQ",
    description: "A weather forecast app with climate analysis and emergency alerts.",
    techStack: ["React", "Express", "MongoDB"]
  },
  {
    title: "StreamSync",
    description: "A video streaming app for educational and collaborative sessions.",
    techStack: ["React", "Firebase", "Node.js"]
  },
  {
    title: "ResuMate",
    description: "A smart resume builder with keyword analysis and job tracking.",
    techStack: ["Django", "MongoDB"]
  },
  {
    title: "BlindDate",
    description: "An anonymous matching app for people based on shared interests.",
    techStack: ["React Native", "Node.js", "MongoDB"]
  },
  {
    title: "BizLaunch",
    description: "A startup idea validation platform with market surveys and mentor connect.",
    techStack: ["Next.js", "Supabase"]
  },
  {
    title: "CodeQuest",
    description: "A platform for gamified coding challenges and skill ladders.",
    techStack: ["React", "Express", "MongoDB"]
  },
  {
    title: "AskDoctor",
    description: "A virtual consultation platform for medical advice and health tracking.",
    techStack: ["Flutter", "Firebase"]
  },
  {
    title: "CampusConnect",
    description: "A college community platform to share events, sell items, and connect.",
    techStack: ["MERN"]
  },
  {
    title: "ScribeBot",
    description: "A voice-to-text transcription tool with AI summarization.",
    techStack: ["Next.js", "FastAPI", "MongoDB"]
  },
  {
    title: "InternHunt",
    description: "An AI-based internship search engine tailored to student profiles.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "Pollify",
    description: "A live polling and survey tool with real-time analytics.",
    techStack: ["Vue", "Firebase"]
  },
  {
    title: "GameVault",
    description: "A gaming community platform with leaderboards and game forums.",
    techStack: ["React", "Express", "MongoDB"]
  },
  {
    title: "SmartResume",
    description: "An intelligent resume parser and analyzer for HR teams.",
    techStack: ["Flask", "MongoDB"]
  },
  {
    title: "QuickMeet",
    description: "A lightweight video call and scheduling platform for professionals.",
    techStack: ["React", "Node.js", "WebRTC"]
  },
  {
    title: "ParkEasy",
    description: "A smart parking locator and booking system using geofencing.",
    techStack: ["Flutter", "Firebase"]
  },
  {
    title: "CleanCity",
    description: "A citizen feedback app to report local issues with photos and location.",
    techStack: ["React Native", "Node.js", "MongoDB"]
  },
  {
    title: "QuizFlow",
    description: "A quiz generator for teachers with analytics and grading system.",
    techStack: ["Vue", "Express", "MongoDB"]
  },
  {
    title: "DevSpace",
    description: "A personal knowledge base and dev notes organizer.",
    techStack: ["Next.js", "SQLite"]
  },
  {
    title: "StackHelp",
    description: "A community Q&A platform for students and coders.",
    techStack: ["MERN"]
  },
  {
    title: "SyncTasks",
    description: "A real-time task syncing app for teams with chat support.",
    techStack: ["React", "Firebase"]
  },
  {
    title: "CarbonCheck",
    description: "A carbon footprint calculator and personal improvement tracker.",
    techStack: ["Flask", "PostgreSQL"]
  },
  {
    title: "DreamHire",
    description: "A reverse job board where students showcase skills and projects.",
    techStack: ["Next.js", "MongoDB"]
  },
  {
    title: "MarketSense",
    description: "A stock market education simulator with virtual trading.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "SleepWell",
    description: "A sleep tracker and smart alarm app with habit recommendations.",
    techStack: ["Flutter", "Firebase"]
  },
  {
    title: "GreenCart",
    description: "A green e-commerce platform promoting sustainable products.",
    techStack: ["Vue", "MongoDB"]
  },
  {
    title: "OpenBoard",
    description: "A collaborative whiteboard for brainstorming and remote teaching.",
    techStack: ["React", "Socket.io", "Node.js"]
  },
  {
    title: "AI Resume Reviewer",
    description: "An AI system that scores resumes against job descriptions.",
    techStack: ["Flask", "Python", "MongoDB"]
  },
  {
    title: "SkillSnap",
    description: "A micro-learning platform with short skill lessons and quizzes.",
    techStack: ["Next.js", "Supabase"]
  },
  {
    title: "RoomMate",
    description: "A platform to find and match roommates based on preferences.",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "CharityChain",
    description: "A blockchain-based transparent donation tracking system.",
    techStack: ["Solidity", "Web3", "React"]
  }
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

    const templatePool = [...projectTemplates];
    let templateIndex = 0;

    for (const user of users) {
      for (let i = 0; i < 2; i++) {
        // Cycle through templates so they don't repeat too soon
        const template = templatePool[templateIndex % templatePool.length];
        templateIndex++;

        const rolesNeeded = getRandomFromArray(roles, Math.floor(Math.random() * 3) + 1); // 1-3 roles

        allProjects.push({
          title: template.title,
          description: template.description,
          techStack: template.techStack,
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
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error creating projects:", err);
    await mongoose.disconnect();
  }
};

createProjects();
