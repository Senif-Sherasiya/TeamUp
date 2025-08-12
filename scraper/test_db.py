# 📁 scraper/test_db.py

from db import hackathon_collection

# Insert dummy data
hackathon_collection.insert_one({
    "title": "Test Hackathon",
    "date": "2025-12-01",
    "location": "Internet"
})

# Fetch and print all hackathons
for hack in hackathon_collection.find():
    print(hack)
