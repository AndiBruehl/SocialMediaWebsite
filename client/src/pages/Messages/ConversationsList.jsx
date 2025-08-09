import { Link } from "react-router-dom";

const API_BASE = "http://localhost:9000";
const abs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (abs(s) ? s : s ? `${API_BASE}${s}` : "");

export default function ConversationsList({ threads, activeId, onSelect }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 font-semibold border-b">Messages</div>
      {threads.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">No conversations.</div>
      ) : (
        threads.map((t) => {
          const title = t.isGroup ? t.name : t.peer?.username || "Unknown";
          const avatar = t.isGroup ? t.avatar : url(t.peer?.profilePicture);
          const isActive = String(activeId) === String(t._id);
          return (
            <button
              key={t._id}
              onClick={() => onSelect(t)}
              className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 ${
                isActive ? "bg-gray-100" : ""
              }`}
            >
              <img
                src={avatar || "/group.png"}
                className="w-10 h-10 rounded-full object-cover"
                alt=""
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />
              <div className="flex-1">
                <div className="font-medium">{title}</div>
                <div className="text-xs text-gray-500 truncate">
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
