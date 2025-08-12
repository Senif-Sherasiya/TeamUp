import React from "react";

export default function RequestsModal({ requests, onAccept, onReject, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Blur background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative z-10 bg-zinc-900 p-6 rounded-2xl max-w-md w-full text-white border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Join Requests</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl">✕</button>
        </div>

        {requests.length === 0 ? (
          <p className="text-gray-400 italic">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.user._id} className="flex justify-between items-center bg-white/10 p-3 rounded">
                <div>
                  <p className="font-medium">{req.user.name}</p>
                  <p className="text-sm text-gray-300">{req.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(req.user._id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(req.user._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
