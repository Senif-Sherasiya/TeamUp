import React from "react";

export default function CreateTeamModal({
  form,
  setForm,
  handleFormChange,
  handleCreateTeam,
  creating,
  setShowCreateModal,
}) {
  const handleCheckboxChange = (role) => {
    const updated = form.lookingForRoles.includes(role)
      ? form.lookingForRoles.filter((r) => r !== role)
      : [...form.lookingForRoles, role];

    setForm((prev) => ({ ...prev, lookingForRoles: updated }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur background layer */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/60"></div>

      {/* Modal content */}
      <div className="relative z-10 bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-md border border-zinc-700 text-white">
        <h2 className="text-2xl font-semibold mb-5 text-white">Create Team</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Team Name"
          className="w-full px-4 py-2 mb-3 rounded bg-zinc-800 border border-zinc-700 placeholder:text-zinc-400"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleFormChange}
          placeholder="Description (optional)"
          className="w-full px-4 py-2 mb-3 rounded bg-zinc-800 border border-zinc-700 placeholder:text-zinc-400"
        />

        <input
          name="techStack"
          value={form.techStack}
          onChange={handleFormChange}
          placeholder="Tech Stack (comma separated)"
          className="w-full px-4 py-2 mb-3 rounded bg-zinc-800 border border-zinc-700 placeholder:text-zinc-400"
        />

        <input
          name="maxSize"
          value={form.maxSize}
          onChange={handleFormChange}
          placeholder="Max Team Size"
          type="number"
          className="w-full px-4 py-2 mb-4 rounded bg-zinc-800 border border-zinc-700 placeholder:text-zinc-400"
        />

        <label className="text-sm font-medium text-white mb-1 block">Looking For Roles</label>
        <div className="flex gap-2 flex-wrap mb-3">
          {["Frontend", "Backend", "UI/UX", "ML/AI", "DevOps", "Mobile"].map((role) => (
            <label key={role} className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                value={role}
                checked={form.lookingForRoles.includes(role)}
                onChange={() => handleCheckboxChange(role)}
                className="mr-2"
              />
              {role}
            </label>
          ))}
        </div>

        <textarea
          name="projectIdea"
          value={form.projectIdea}
          onChange={handleFormChange}
          placeholder="Describe your project idea (optional)"
          className="w-full px-4 py-2 mb-3 rounded bg-zinc-800 border border-zinc-700 placeholder:text-zinc-400"
        />

        <label className="text-sm font-medium text-white mb-1 block">Preferred Work Mode</label>
        <select
          name="workMode"
          value={form.workMode}
          onChange={handleFormChange}
          className="w-full px-4 py-2 mb-4 rounded bg-zinc-800 border border-zinc-700 text-white"
        >
          <option value="">Select Work Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTeam}
            disabled={creating}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
