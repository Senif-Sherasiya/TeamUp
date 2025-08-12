import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserPanel = ({
  sidebarOpen,
  setSidebarOpen,
  user,
  setShowEditModal,
}) => {
  const navigate = useNavigate();

  function InfoItem({ label, value }) {
    return (
      <div>
        <div className="text-sm text-zinc-400">{label}</div>
        <div className="text-base font-medium text-zinc-100 break-words">{value}</div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Blur Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-96 max-w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-l border-zinc-700 shadow-2xl p-6 z-50 overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-zinc-300 text-2xl font-bold hover:text-zinc-100"
              aria-label="Close Panel"
            >
              &times;
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-700 pb-4">
              <User className="w-6 h-6 text-zinc-400" />
              <h2 className="text-xl font-semibold text-zinc-100">User Profile</h2>
            </div>

            {/* Info */}
            <div className="space-y-5">
              <InfoItem label="Name" value={user.name} />
              <InfoItem label="Email" value={user.email} />
              {user.bio && <InfoItem label="Bio" value={user.bio} />}
              {user.skills?.length > 0 && (
                <InfoItem label="Skills" value={user.skills.join(", ")} />
              )}
              {user.github && (
                <InfoItem
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
                <InfoItem
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
              <InfoItem label="User ID" value={user._id} />
              <InfoItem
                label="Joined"
                value={new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
              >
                Edit Profile
              </button>

              <button
                onClick={async () => {
                  await fetch("http://localhost:5070/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  navigate("/");
                }}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-200"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserPanel;
