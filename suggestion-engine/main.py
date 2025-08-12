# suggestion-engine/main.py
from fastapi import FastAPI
from bson import ObjectId
from db import users_collection, projects_collection, hackathons_collection
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.get("/suggest/projects/{user_id}")
async def suggest_projects(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {"error": "User not found"}

    user_text = " ".join(user.get("skills", [])) + " " + user.get("bio", "")
    user_embedding = model.encode([user_text])[0]

    all_projects = list(projects_collection.find({}))
    project_infos = []
    project_embeddings = []

    for project in all_projects:
        project_text = (
            project.get("title", "") + " " +
            project.get("description", "") + " " +
            " ".join(project.get("techStack", [])) + " " 
            " ".join(project.get("rolesNeeded", []))
        )
        embedding = model.encode([project_text])[0]
        project_infos.append({
            "_id": str(project["_id"]),
            "title": project.get("title", ""),
        })
        project_embeddings.append(embedding)

    if not project_embeddings:
        return {"error": "No projects found"}

    # Compute cosine similarity between user and all projects
    similarities = cosine_similarity([user_embedding], project_embeddings)[0]
    
    # Attach similarity scores and sort
    for i, score in enumerate(similarities):
        project_infos[i]["match_score"] = round(float(score), 4)

    project_infos.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "user_input": user_text,
        "suggested_projects": project_infos[:6]  # return top 10
    }


@app.get("/suggest/hackathons/{user_id}")
async def suggest_hackathons(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {"error": "User not found"}

    # Create user input text from skills and bio
    user_text = " ".join(user.get("skills", [])) + " " + user.get("bio", "")
    user_embedding = model.encode([user_text])[0]

    all_hackathons = list(hackathons_collection.find({}))
    hackathon_infos = []
    hackathon_embeddings = []

    for h in all_hackathons:
        themes = " ".join(h.get("themes", []))
        text = f"{h.get('title', '')} {h.get('subtitle', '')} {themes} {h.get('location', '')}"
        embedding = model.encode([text])[0]

        hackathon_infos.append({
            "_id": str(h["_id"]),
            "title": h.get("title", ""),
        })
        hackathon_embeddings.append(embedding)

    if not hackathon_embeddings:
        return {"error": "No hackathons found"}

    # Calculate similarities
    similarities = cosine_similarity([user_embedding], hackathon_embeddings)[0]

    for i, score in enumerate(similarities):
        hackathon_infos[i]["match_score"] = round(float(score), 4)

    hackathon_infos.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "user_input": user_text,
        "suggested_hackathons": hackathon_infos[:6]  # Top 6
    }