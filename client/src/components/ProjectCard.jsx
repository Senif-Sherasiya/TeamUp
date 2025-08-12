import React from "react";
import { Link } from "react-router-dom";
import { Users, Code, Lightbulb, UserPlus } from "lucide-react";

export default function ProjectCard({
  project,
  onOpenRequestsModal,
  onJoinProject,
  hasRequested,
}) {
  const {
    title,
    description,
    techStack = [],
    rolesNeeded = [],
    projectIdea,
    teamMembers = [],
    joinRequests = [],
    createdBy,
    loggedInUserId,
    _id: projectId,
  } = project;

  const isCreatedByUser = createdBy?._id === loggedInUserId;
  const isTeamMember = teamMembers.some((m) => m.user?._id === loggedInUserId);

  const visibleMembers = teamMembers.slice(0, 3);
  const extraMembers = teamMembers.slice(3);

  return (
    <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.015] transition-transform duration-300">
      {/* 🔔 Join Request Badge */}
      {isCreatedByUser && joinRequests.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenRequestsModal(project);
          }}
          className="absolute top-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full shadow"
        >
          {joinRequests.length} Request{joinRequests.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
        {description || "No description provided."}
      </p>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200 mb-4">
        <p className="flex items-center gap-2">
          <Users size={16} className="text-purple-500" />
          Members: {teamMembers.length}
        </p>
        <p className="flex items-center gap-2">
          <Code size={16} className="text-purple-500" />
          Tech Stack: {techStack.length ? techStack.join(", ") : "N/A"}
        </p>
        <p className="flex items-center gap-2">
          <UserPlus size={16} className="text-purple-500" />
          Looking For: {rolesNeeded.length ? rolesNeeded.join(", ") : "N/A"}
        </p>
        {projectIdea && (
          <p className="flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-400" />
            Idea: {projectIdea}
          </p>
        )}
      </div>

      {/* Avatars */}
      <div className="flex items-center gap-2 mb-4">
        {visibleMembers.map((member, idx) => {
          const user = member.user;
          const userId = typeof user === "object" ? user._id : user;
          const userName = typeof user === "object" ? user.name : "User";

          return (
            <div className="relative group" key={userId || idx}>
              <Link
                to={`/profile/${userId}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-10 w-max max-w-[140px] text-center whitespace-nowrap pointer-events-none">
                {userName}
              </div>
            </div>
          );
        })}
        {extraMembers.length > 0 && (
          <div className="relative group">
            <div className="w-9 h-9 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-semibold">
              +{extraMembers.length}
            </div>
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-10 w-max max-w-[160px] text-center whitespace-normal pointer-events-none">
              {extraMembers.map((m) => (typeof m.user === "object" ? m.user.name : "User")).join(", ")}
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      {!isCreatedByUser && !isTeamMember && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoinProject(projectId);
          }}
          disabled={hasRequested}
          className={`w-full py-2.5 rounded-md font-semibold text-sm transition ${
            hasRequested
              ? "bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {hasRequested ? "Requested" : "Request to Join"}
        </button>
      )}

      {/* Creator */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        By: {createdBy?._id ? (
          <Link
            to={`/profile/${createdBy._id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-blue-500 hover:underline"
          >
            {createdBy.name || "Unknown"}
          </Link>
        ) : (
          "Unknown"
        )}
      </div>
    </div>
  );
}
