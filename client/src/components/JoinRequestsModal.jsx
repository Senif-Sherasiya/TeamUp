import React from "react";

export default function JoinRequestsModal({
  team,
  onClose,
  onAccept,
  onReject,
}) {
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative z-10 bg-zinc-900 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto border border-zinc-700">
        <h2 className="text-xl font-bold text-white mb-4">
          Join Requests for "{team.name}"
        </h2>
        {team.joinRequests?.length > 0 ? (
          team.joinRequests.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center text-white mb-3"
            >
              <span>
                {user.name} ({user.email})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onAccept(team._id, user._id);
                    onClose();
                  }}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 text-sm rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    onReject(team._id, user._id);
                    onClose();
                  }}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-300">No join requests</p>
        )}

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
