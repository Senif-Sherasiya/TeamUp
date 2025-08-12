import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import TeamCard from "../components/TeamCard";

export default function PublicProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:5070/api/users/${userId}/full`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error loading public profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  if (loading) return <div className="p-8 text-zinc-200">Loading profile...</div>;
  if (!user) return <div className="p-8 text-zinc-200">User not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white px-4 sm:px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 dark:border-zinc-700 pb-4">
            <User className="w-6 h-6 text-zinc-400" />
            <h1 className="text-2xl font-bold text-zinc-100">Public Profile</h1>
          </div>

          <div className="space-y-5">
            <Detail label="Name" value={user.name} />
            {user.bio && <Detail label="Bio" value={user.bio} />}
            {user.skills?.length > 0 && (
              <Detail label="Skills" value={user.skills.join(", ")} />
            )}
            {user.github && (
              <Detail
                label="GitHub"
                value={
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {user.github}
                  </a>
                }
              />
            )}
            {user.linkedin && (
              <Detail
                label="LinkedIn"
                value={
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {user.linkedin}
                  </a>
                }
              />
            )}
            <Detail
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
          </div>
        </div>

        {/* Teams Section */}
        <div>
          <h3 className="text-2xl font-semibold text-zinc-100 mb-4 border-b border-zinc-700 pb-2">
            Teams Created by {user.name}
          </h3>

          {(user.teamsCreated || []).length === 0 ? (
            <p className="text-zinc-400 italic">This user hasn’t created any teams yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {(user.teamsCreated || []).map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-zinc-400 text-sm mb-1">{label}:</div>
      <div className="text-lg font-medium text-zinc-100">{value}</div>
    </div>
  );
}
