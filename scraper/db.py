# 📁 scraper/db.py

import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()

# Fetch Mongo URI and DB name
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

# Example: Accessing the hackathons collection
hackathon_collection = db["hackathons"]