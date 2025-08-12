import React from "react";
import { useNavigate } from "react-router-dom";

export default function HackathonCard({ hackathon }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/hackathons/${hackathon._id}`)}
      className="cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.015] transition-transform duration-300"
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">
        {hackathon.title || "Untitled Hackathon"}
      </h3>

      {/* Subtitle */}
      {hackathon.subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {hackathon.subtitle.length > 140
            ? hackathon.subtitle.slice(0, 140) + "..."
            : hackathon.subtitle}
        </p>
      )}

      {/* Tag Info */}
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        {hackathon.deadline && (
          <span className="bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
            ⏳ Deadline: {hackathon.deadline}
          </span>
        )}
        {hackathon.location && (
          <span className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            📍 {hackathon.location}
          </span>
        )}
        {hackathon.visibility && (
          <span className="bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
            👁️ {hackathon.visibility}
          </span>
        )}
        {hackathon.participants && (
          <span className="bg-yellow-100 dark:bg-yellow-600/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
            👥 {hackathon.participants} Participants
          </span>
        )}
        {hackathon.prize && (
          <span className="bg-pink-100 dark:bg-pink-600/20 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full">
            💰 Prize: {hackathon.prize}
          </span>
        )}
      </div>

      {/* Host */}
      {hackathon.host && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-gray-500 dark:text-gray-400">Host:</span> {hackathon.host}
        </p>
      )}

      {/* Eligibility */}
      {hackathon.eligibility?.filter((e) => e.trim() !== "").length > 0 && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-gray-500 dark:text-gray-400">Eligibility:</span> {hackathon.eligibility.join(", ")}
        </p>
      )}

      {/* Themes */}
      {hackathon.themes?.filter((e) => e.trim() !== "").length > 0 && (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium text-gray-500 dark:text-gray-400">Themes:</span> {hackathon.themes.join(", ")}
        </p>
      )}

      {/* Visit Link */}
      {hackathon.url && (
        <a
          href={hackathon.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          🔗 Visit Hackathon
        </a>
      )}
    </div>
  );
}
