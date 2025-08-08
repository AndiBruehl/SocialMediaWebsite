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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <img
          src={avatar || "/default-avatar.png"}
          alt=""
          className="w-9 h-9 rounded-full object-cover"
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
        <div className="font-semibold">{title}</div>
      </div>
      {/* Messages */}
      <div
        className="overflow-y-auto p-4 space-y-2 bg-white max-h-[65vh]"
        ref={messagesContainerRef}
      >
        {!messages || messages.length === 0 ? (
          <div className="text-sm text-gray-500">Noch keine Nachrichten.</div>
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
                : "Unbekannt";
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
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
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
      <div className="border-t p-3 bg-gray-50">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Nachricht schreiben…"
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
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 flex items-center gap-2"
          >
            <BiSend /> Senden
          </button>
        </div>
      </div>
    </div>
  );
}
