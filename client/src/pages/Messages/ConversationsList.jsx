import { Link } from "react-router-dom";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const abs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (abs(s) ? s : s ? `${API_BASE}${s}` : "");

export default function ConversationsList({ threads, activeId, onSelect }) {
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="p-3 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
        Messages
      </div>

      {/* Empty State */}
      {threads.length === 0 ? (
        <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
          No conversations.
        </div>
      ) : (
        threads.map((t) => {
          const title = t.isGroup ? t.name : t.peer?.username || "Unknown";
          const avatar = t.isGroup ? t.avatar : url(t.peer?.profilePicture);
          const isActive = String(activeId) === String(t._id);
          return (
            <button
              key={t._id}
              onClick={() => onSelect(t)}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors duration-200 ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-white"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200"
              }`}
            >
              <img
                src={avatar || "/group.png"}
                className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                alt=""
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />
              <div className="flex-1">
                <div className="font-medium truncate">{title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {t.lastMessage?.text || "—"}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
