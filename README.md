# 🤝 TeamUp – Find Teammates, Join Hackathons, Build Projects Together

TeamUp is a platform that helps people **find teammates** for their project ideas or **join hackathon teams**.  
It’s built with **React + Vite** (frontend), **Express.js** (backend), and **Python** services (Scraper + FastAPI Suggestion Engine).  
Designed for **speed, scalability, and collaboration**.

---

## 📂 Project Structure
client/ # React + Vite frontend
server/ # Express backend (Node.js + MongoDB)
scraper/ # Python scraper for fetching external hackathon/project data
suggestion-engine/ # Python FastAPI service for recommendations


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
- [MongoDB](https://www.mongodb.com/try/download/community)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/teamup.git
cd teamup

cd client
npm install
npm run dev


cd ../server
npm install
npm run dev


cd ../scraper
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py


cd ../suggestion-engine
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
uvicorn main:app --reload --port 8001


server/.env
MONGO_URI=mongodb://localhost:27017/devmate
JWT_SECRET=devmate_super_secret_token

suggestion-engine/.env
MONGO_URI=mongodb://localhost:27017
DB_NAME=devmate

scraper/.env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=devmate

