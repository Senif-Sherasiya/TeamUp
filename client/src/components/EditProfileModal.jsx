import React, { useEffect, useState } from "react";

export default function EditProfileModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:5070/api/auth/me", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const user = data.user;
          setForm({
            name: user.name || "",
            bio: user.bio || "",
            github: user.github || "",
            linkedin: user.linkedin || "",
            skills: (user.skills || []).join(", "),
          });
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      name: form.name,
      bio: form.bio,
      github: form.github,
      linkedin: form.linkedin,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const res = await fetch("http://localhost:5070/api/auth/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert("Profile updated successfully!");
      onClose();
    } else {
      alert("Update failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur background layer */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/60"></div>

      {/* Modal content */}
      <div className="relative z-10 bg-zinc-900 text-white p-6 rounded-2xl w-full max-w-xl shadow-xl border border-zinc-700">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-zinc-300">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">GitHub</label>
            <input
              type="url"
              name="github"
              value={form.github}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-300">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
