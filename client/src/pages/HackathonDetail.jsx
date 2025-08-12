import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateTeamModal from "../components/CreateTeamModal";
import TeamCard from "../components/TeamCard";
import JoinRequestsModal from "../components/JoinRequestsModal";

export default function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [teams, setTeams] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinRequestedTeamIds, setJoinRequestedTeamIds] = useState([]);
  const [creating, setCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalTeam, setModalTeam] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    techStack: "",
    maxSize: "",
    lookingForRoles: [],
    projectIdea: "",
    workMode: "",
  });

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreateTeam() {
    if (!form.name || !form.maxSize) {
      alert("Team name and max size are required.");
      return;
    }
    try {
      setCreating(true);
      const res = await fetch(`http://localhost:5070/api/teams/hackathon/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            techStack: form.techStack.split(",").map(t => t.trim()),
            maxSize: Number(form.maxSize)
          })
        }
      );
      if (!res.ok) throw new Error("Failed to create team");
      const newTeam = await res.json();
      setTeams((prev) => [...prev, newTeam]);
      setUserTeam(newTeam);
      setShowCreateModal(false);
      setForm({ name: "", description: "", techStack: "", maxSize: "" });
    } catch (err) {
      alert("Team creation failed. Try again.");
    } finally {
      setCreating(false);
    }
  }

  async function sendJoinRequest(teamId) {
    try {
      const res = await fetch(`http://localhost:5070/api/teams/${teamId}/join`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send join request");
      setJoinRequestedTeamIds(prev => [...prev, teamId]);
    } catch (err) {
      alert("Could not send join request");
    }
  }

  async function handleAccept(teamId, userId) {
    try {
      const res = await fetch(`http://localhost:5070/api/teams/${teamId}/accept`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to accept user");
      await fetchTeams();
    } catch (err) {
      alert("Failed to accept user");
    }
  }

  async function handleReject(teamId, userId) {
    try {
      const res = await fetch(`http://localhost:5070/api/teams/${teamId}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to reject user");
      await fetchTeams();
    } catch (err) {
      alert("Failed to reject user");
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch("http://localhost:5070/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not logged in");
      const { user } = await res.json();
      setCurrentUser(user);
    } catch (err) { }
  }

  async function fetchTeams() {
    try {
      const res = await fetch(`http://localhost:5070/api/teams/hackathon/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();
      setTeams(data.teams || []);
      setUserTeam(data.userTeam || null);
      setJoinRequestedTeamIds(data.joinRequestedTeamIds || []);
    } catch (err) {
      setError("Failed to load teams.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchHackathonDetails() {
      try {
        const res = await fetch(`http://localhost:5070/api/hackathons/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Hackathon not found");
        const data = await res.json();
        setHackathon(data);
      } catch (err) {
        setError("Hackathon not found or server error.");
      }
    }
    fetchCurrentUser();
    fetchHackathonDetails();
    fetchTeams();
  }, [id]);

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-300 mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!hackathon) return <div className="text-center text-yellow-500 mt-10">Hackathon not available.</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-zinc-950 text-gray-800 dark:text-white">
      <button
        onClick={() => navigate("/dashboard?tab=hackathons")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back
      </button>

      <div className="max-w-5xl mx-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">{hackathon.title}</h1>
        {hackathon.subtitle && <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{hackathon.subtitle}</p>}

        <div className="flex flex-wrap gap-2 text-sm mb-4">
          {hackathon.deadline && <span className="bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">⏳ Deadline: {hackathon.deadline}</span>}
          {hackathon.location && <span className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">📍 {hackathon.location}</span>}
          {hackathon.visibility && <span className="bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">👁️ {hackathon.visibility}</span>}
          {hackathon.participants && <span className="bg-yellow-100 dark:bg-yellow-600/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full">👥 {hackathon.participants} Participants</span>}
          {hackathon.prize && <span className="bg-pink-100 dark:bg-pink-600/20 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full">💰 Prize: {hackathon.prize}</span>}
        </div>

        <div className="text-sm space-y-1 mb-3">
          <p><span className="font-semibold text-gray-500 dark:text-gray-400">Hosted By:</span> {hackathon.host}</p>
          {hackathon.eligibility?.length > 0 && <p><span className="font-semibold text-gray-500 dark:text-gray-400">Eligibility:</span> {hackathon.eligibility.join(", ")}</p>}
          {hackathon.themes?.length > 0 && <p><span className="font-semibold text-gray-500 dark:text-gray-400">Themes:</span> {hackathon.themes.join(", ")}</p>}
        </div>

        {hackathon.url && <a href={hackathon.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">🔗 Visit Hackathon</a>}
      </div>

      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Teams</h2>

        {userTeam ? (
          <div className="bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 rounded-xl p-5 mb-6">
            You're part of team: <strong>{userTeam.name}</strong>
          </div>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mb-6"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Team
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(teams || []).map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              isHackathonContext={true}
              currentUser={currentUser}
              userTeam={userTeam}
              joinRequestedTeamIds={joinRequestedTeamIds}
              onJoinRequest={sendJoinRequest}
              onAccept={handleAccept}
              onReject={handleReject}
              onOpenRequestsModal={(team) => setModalTeam(team)}
            />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateTeamModal
          form={form}
          setForm={setForm}
          handleFormChange={handleFormChange}
          handleCreateTeam={handleCreateTeam}
          creating={creating}
          setShowCreateModal={setShowCreateModal}
        />
      )}

      {modalTeam && (
        <JoinRequestsModal
          team={modalTeam}
          onClose={() => setModalTeam(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
