import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: [],
    github: "",
    rolesNeeded: [],
    maxMembers: 5,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayChange = (name, value) => {
    setForm({ ...form, [name]: value.split(",").map((item) => item.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5070/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 p-8 rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">Create New Project</h2>

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          required
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-400"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Project Description"
          required
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-400"
          rows={4}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="techStack"
          placeholder="Tech Stack (comma separated, e.g., React, Node.js)"
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-400"
          onChange={(e) => handleArrayChange("techStack", e.target.value)}
        />

        <input
          type="text"
          name="rolesNeeded"
          placeholder="Roles Needed (comma separated, e.g., Frontend, Backend)"
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-400"
          onChange={(e) => handleArrayChange("rolesNeeded", e.target.value)}
        />

        <input
          type="url"
          name="github"
          placeholder="GitHub Repository Link (optional)"
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-400"
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxMembers"
          placeholder="Max Team Members (default: 5)"
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-400"
          onChange={handleChange}
          min={1}
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
