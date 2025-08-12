const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); 

const MONGO_URI = "mongodb://localhost:27017/devmate";

const skillPool = [
  "mern", "react", "node", "express", "mongodb", "sql", "firebase",
  "python", "django", "flask", "c++", "java", "springboot",
  "git", "github", "docker", "kubernetes", "aws", "gcp",
  "ml", "dl", "nlp", "data science", "pandas", "numpy"
];

const names = [
  "Aarav Patel", "Ishaan Sharma", "Vivaan Verma", "Reyansh Singh", "Aditya Mehta",
  "Ayaan Joshi", "Arjun Reddy", "Kabir Das", "Krishna Menon", "Dev Sharma",
  "Anaya Kapoor", "Myra Agarwal", "Siya Desai", "Aadhya Rao", "Pari Shah",
  "Kiara Iyer", "Meera Jain", "Tara Bhat", "Saanvi Nair", "Riya Sen",
  "Atharv Kulkarni", "Dhruv Sinha", "Yuvraj Bhatt", "Harshit Tiwari", "Lakshya Kumar",
  "Tanvi Mishra", "Avni Saxena", "Prisha Vyas", "Navya Tripathi", "Niharika Rao",
  "Om Khanna", "Rudra Kapoor", "Shivansh Chauhan", "Ira Mahajan", "Naina Joshi",
  "Advait Jadhav", "Veer Malhotra", "Zoya Pandey", "Aaliya Khan", "Suhana Mehta"
];

function getRandomSkills(count = 4) {
  const shuffled = skillPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function createMockUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const passwordHash = await bcrypt.hash("Pass@123", 10);

    const users = names.map((name, index) => ({
      name,
      email: `user${index + 1}@gmail.com`,
      password: passwordHash,
      bio: `Hi, I am ${name.split(" ")[0]}, passionate about coding.`,
      github: `https://github.com/${name.toLowerCase().replace(" ", "")}`,
      linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(" ", "")}`,
      skills: getRandomSkills(4 + Math.floor(Math.random() * 2)), // 4–5 skills
      teamsCreated: []
    }));

    await User.insertMany(users);
    console.log("40 users created successfully.");
  } catch (err) {
    console.error("Error creating users:", err);
  } finally {
    mongoose.disconnect();
  }
}

createMockUsers();
