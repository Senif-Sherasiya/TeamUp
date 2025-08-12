const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      })
      .json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("🔥 Registration Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res
      .cookie("token", token, { httpOnly: true })
      .json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("/me Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.put("/update", auth, async (req, res) => {
  try {
    const allowedFields = ["name", "bio", "github", "linkedin", "skills"];
    const updates = Object.keys(req.body);

    const isValid = updates.every(field => allowedFields.includes(field));
    if (!isValid) {
      return res.status(400).json({ error: "Invalid fields in request" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    updates.forEach(field => {
      user[field] = req.body[field];
    });

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// // GET /api/users/:userId
// router.get("/users/:userId", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId).select("-password");
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json({ user });
//     } catch (err) {
//         console.error("Public profile error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// });


module.exports = router;
