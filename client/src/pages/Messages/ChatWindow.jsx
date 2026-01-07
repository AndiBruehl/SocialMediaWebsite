import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";

export default function ChatWindow({
  title,
  avatar,
  messages,
  meId,
  onSend,
  sending,
}) {
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);

  // Scroll to top when new messages are added
  useEffect(() => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [messages?.length]);

  const handleSendClick = (e) => {
    e.preventDefault(); // Prevent default form submission
    const text = input.trim();
    if (!text) return;
    onSend?.(text);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
        <img
          src={avatar || "/default-avatar.png"}
          alt=""
          className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
        <div className="font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
      </div>

      {/* Messages */}
      <div
        className="overflow-y-auto p-4 space-y-2 bg-white dark:bg-gray-900 max-h-[65vh] scrollbar-hide"
        ref={messagesContainerRef}
      >
        {!messages || messages.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No messages yet.
          </div>
        ) : (
          [...messages]
            .reverse() // Reverse messages to show newest at top
            .map((m, idx) => {
              const myMsg = String(m.sender?._id || m.sender) === String(meId);
              // unique key: prefer _id, else createdAt+idx
              const key = m._id || `${m.createdAt || "ts"}-${idx}`;
              // Format timestamp (assuming createdAt is a valid date string)
              const timestamp = m.createdAt
                ? new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown";
              return (
                <div
                  key={key}
                  className={`flex ${myMsg ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[70%]">
                    <div
                      className={`rounded px-3 py-2 text-sm ${
                        myMsg
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div
                      className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                        myMsg ? "text-right" : "text-left"
                      }`}
                    >
                      {timestamp}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 transition-colors">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent form submission
                handleSendClick(e);
              }
            }}
          />
          <button
            onClick={handleSendClick}
            disabled={sending || !input.trim()}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <BiSend /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
