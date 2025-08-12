import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Code,
  Lightbulb,
  MapPin,
  UserPlus,
} from "lucide-react";

export default function TeamCard({ 
  team, 
  onAccept, 
  onReject, 
  onOpenRequestsModal,
  isHackathonContext = false,
  currentUser = null,
  userTeam = null,
  joinRequestedTeamIds = [],
  onJoinRequest = null
}) {
  const MAX_VISIBLE = 3;
  const visibleMembers = team.members?.slice(0, MAX_VISIBLE) || [];
  const extraMembers = team.members?.slice(MAX_VISIBLE) || [];

  return (
    <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300">
      {team.joinRequests && team.joinRequests.length > 0 && onOpenRequestsModal &&
        (!isHackathonContext || (isHackathonContext && currentUser && currentUser._id === team.creator?._id)) && (
          <button
            onClick={() => onOpenRequestsModal(team)}
            className="absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-sm text-black px-3 py-1 rounded"
          >
            {team.joinRequests.length} Request{team.joinRequests.length > 1 ? "s" : ""}
          </button>
      )}

      {!isHackathonContext && (
        <>
          <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1">
            {team.hackathonId?.title || "Untitled Hackathon"}
          </h2>
          {team.hackathonId?.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {team.hackathonId.subtitle}
            </p>
          )}
        </>
      )}

      <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{team.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">
        {team.description || "No description"}
      </p>

      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
        <p className="flex items-center gap-2">
          <Users size={18} className="text-purple-500" />
          Team Size: {team.members?.length || 0} / {team.maxSize}
        </p>
        <p className="flex items-center gap-2">
          <Code size={18} className="text-purple-500" />
          Tech Stack: {(team.techStack || []).join(", ") || "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <UserPlus size={18} className="text-purple-500" />
          Looking For: {(team.lookingForRoles || []).join(", ") || "N/A"}
        </p>
        {team.projectIdea && (
          <p className="flex items-center gap-2">
            <Lightbulb size={18} className="text-yellow-500" />
            Idea: {team.projectIdea}
          </p>
        )}
        <p className="flex items-center gap-2">
          <MapPin size={18} className="text-purple-500" />
          Work Mode: {team.workMode?.charAt(0).toUpperCase() + team.workMode.slice(1)}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {visibleMembers.map((member) => (
          <div key={member._id} className="relative group">
            <Link to={`/profile/${member._id}`} className="relative group">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {member.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                {member.name}
              </div>
            </Link>
          </div>
        ))}
        {extraMembers.length > 0 && (
          <div className="relative group">
            <div className="w-9 h-9 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-semibold">
              +{extraMembers.length}
            </div>
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 max-w-xs">
              {extraMembers.map((m) => m.name).join(", ")}
            </div>
          </div>
        )}
      </div>

      {isHackathonContext && (
        <div className="mt-4">
          {!userTeam ? (
            joinRequestedTeamIds.includes(team._id) ? (
              <button
                disabled
                className="w-full bg-yellow-600 text-white py-2 rounded-md text-sm font-medium opacity-70 cursor-not-allowed"
              >
                Requested
              </button>
            ) : (
              <button
                onClick={() => onJoinRequest && onJoinRequest(team._id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition"
              >
                Request to Join
              </button>
            )
          ) : (
            userTeam._id === team._id &&
            !(currentUser && currentUser._id === team.creator?._id && team.joinRequests?.length > 0) && (
              <div className="w-full text-center text-green-500 font-semibold text-sm">
                You're in this team
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
