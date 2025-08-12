const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose"); 
require("dotenv").config();

const app = express();
const projectRoutes = require("./routes/projects");
const hackathonRoutes = require("./routes/hackathonRoutes");
const teamRoutes = require("./routes/teams");
const userRoutes = require('./routes/user');
const suggestionsRoutes = require('./routes/suggestions');

//MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", projectRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/teams", teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionsRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5070;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
