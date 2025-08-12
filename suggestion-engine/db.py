# suggestion-engine/db.py
from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["devmate"]

users_collection = db["users"]
projects_collection = db["projects"]
hackathons_collection = db["hackathons"]
