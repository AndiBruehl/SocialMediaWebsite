import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/api/axiosInstance";

export default function ChatWindow({ me, conversation }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // Nachrichten laden
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(
          `/messages/conversation/${conversation._id}`
        );
        // falls dein GET anders ist: anpassen. Du hast z.B. getConversation(user1,user2).
        // BESSER: ergänze einen GET /messages/by-conversation/:conversationId
        setMsgs(res.data || []);
      } catch (e) {
        console.error("load messages failed:", e);
      }
    };
    if (conversation?._id) load();
  }, [conversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = async (e) => {
    e?.preventDefault?.();
    const t = text.trim();
    if (!t) return;
    try {
      const res = await axiosInstance.post(`/messages/send`, {
        conversationId: conversation._id,
        sender: me._id,
        text: t,
      });
      setMsgs((prev) => [...prev, res.data]);
      setText("");
    } catch (e) {
      console.error("send failed:", e);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b font-semibold">
        {conversation.isGroup
          ? conversation.name || "Gruppe"
          : (conversation.participants || [])
              .filter((u) => String(u._id) !== String(me._id))
              .map((u) => u.username)
              .join(", ") || "Chat"}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.map((m) => {
          const mine = String(m.sender?._id || m.sender) === String(me._id);
          return (
            <div
              key={m._id}
              className={`max-w-[70%] rounded px-3 py-2 ${
                mine ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-gray-100"
              }`}
            >
              {m.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Nachricht schreiben…"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Senden
        </button>
      </form>
    </div>
  );
}
