# 🤝 TeamUp – Find Teammates for Projects and Hackathons.

TeamUp is a collaboration platform where users can:
- **Find teammates** for their own project ideas.
- **Join existing teams** for projects or hackathons.
- **Create hackathon teams** and invite others to join.
- **Browse and join open teams** under ongoing hackathons.

Built with:
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + MongoDB
- **Services:** Python Scraper + FastAPI Suggestion Engine

---

## 📂 Project Structure

teamup/
├── client/ # React + Vite frontend
├── server/ # Express backend (Node.js + MongoDB)
│ └── scripts/ # Utility scripts for populating the database
├── scraper/ # Python scraper for fetching hackathon/project data
└── suggestion-engine/ # Python FastAPI service for recommendations


## ✨ Features
- 🔍 **Discover Projects** – Browse project ideas posted by others
- 📢 **Find Teammates** – Post your own idea and receive join requests
- 🏆 **Hackathon Teams** – Create or join hackathon-specific teams
- 🤖 **AI-Powered Suggestions** – Get project or teammate recommendations
- 📜 **Centralized Hackathon Structure** – Multiple teams under one hackathon
- 🔒 **Authentication** – Secure login and registration
- 🌙 **Modern UI** – Clean, fast, and responsive design

---

## 🛠 Tech Stack
| Layer         | Technology |
|--------------|------------|
| Frontend     | React + Vite, Tailwind CSS |
| Backend      | Express.js, Node.js |
| Database     | MongoDB |
| Scraper      | Python, BeautifulSoup/Requests |
| Suggestion   | Python, FastAPI, Sentence Transformers |
| Package Mgmt | npm, pip |

---

## ⚙ Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/) (3.9+ recommended)
- [Git](https://git-scm.com/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)  
  Install & start MongoDB on macOS via Homebrew:
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community

---


## 🚀 Getting Started (macOS) — Step-by-step

> These steps assume you're on macOS. Run each service in its own terminal tab/window.

### 0️⃣ Prerequisites
Make sure these are installed:
- Node.js (v18+)
- Python 3.9+
- Git
- Homebrew (optional, used to install MongoDB)
- MongoDB Community (start via Homebrew)
```bash
# (only if MongoDB not installed)
brew tap mongodb/brew
brew install mongodb-community

# start MongoDB service
brew services start mongodb-community

1️⃣ Clone the repo
git clone https://github.com/yourusername/teamup.git
cd teamup

2️⃣ Frontend (React + Vite)
cd client
npm install
npm run dev

3️⃣ Backend (Express + MongoDB)
Open a new terminal tab:
cd teamup/server
npm install

# create server/.env with these values
cat > .env <<EOL
MONGO_URI=mongodb://localhost:27017/devmate
JWT_SECRET=devmate_super_secret_token
EOL

# start backend (use your dev script, e.g. nodemon)
npm run dev

Note: If you have seeding scripts to populate the DB, they are in server/scripts/. Example:
# run a seed script (example filename)
node scripts/seedDatabase.js

4️⃣ Scraper (Python)
Open a new terminal tab:
cd teamup/scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# create scraper/.env
cat > .env <<EOL
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=devmate
EOL

# run the scraper (example)
python3 devpost_scraper.py

5️⃣ Suggestion Engine (FastAPI)
Open a new terminal tab:
cd teamup/suggestion-engine
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# create suggestion-engine/.env
cat > .env <<EOL
MONGO_URI=mongodb://localhost:27017
DB_NAME=devmate
EOL

# recommended: run with explicit port 8000
uvicorn main:app --reload --port 8000

# if `uvicorn` is not available as a shell command, use:
python3 -m uvicorn main:app --reload --port 8000

🌐 Access Points
Frontend: http://localhost:5173
Backend API: http://localhost:5070
Suggestion Engine API: http://localhost:8000