import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/api/axiosInstance";
import ConversationsList from "./ConversationsList";
import ChatWindow from "../../components/Messages/ChatWindow";
import { useSocket } from "../../context/SocketContext";

export default function Messages() {
  const { currentUser } = useContext(AuthContext) || {};
  const me = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      return currentUser || parsed?.user || parsed || null;
    } catch {
      return currentUser;
    }
  }, [currentUser]);

  const socket = useSocket();

  const [threads, setThreads] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // load conversations
  useEffect(() => {
    if (!me?._id) return;
    (async () => {
      const res = await axiosInstance.get(`/messages/conversations/${me._id}`);
      setThreads(res.data?.conversations || []);
      if (!active && res.data?.conversations?.length) {
        setActive(res.data.conversations[0]);
      }
    })();
  });

  // load messages for active
  useEffect(() => {
    if (!active || !me?._id) return;
    (async () => {
      try {
        setLoading(true);
        if (active.isGroup) {
          const res = await axiosInstance.get(`/group/message/${active._id}`);
          setMessages(res.data || []);
        } else {
          const peerId = active?.peer?._id;
          const res = await axiosInstance.get(
            `/messages/conversation/${me._id}/${peerId}`
          );
          setMessages(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  });

  // live updates
  useEffect(() => {
    if (!socket) return;
    const onIncoming = (msg) => {
      if (!active) return;
      const belongsToActive =
        (active.isGroup && String(msg.conversationId) === String(active._id)) ||
        (!active.isGroup &&
          ((String(msg.sender) === String(active?.peer?._id) &&
            String(msg.recipient) === String(me._id)) ||
            (String(msg.sender) === String(me._id) &&
              String(msg.recipient) === String(active?.peer?._id))));
      if (belongsToActive) setMessages((prev) => [...prev, msg]);
    };
    socket.on("message:new", onIncoming);
    return () => socket.off("message:new", onIncoming);
  }, [socket, active, me?._id]);

  const handleSend = async ({ text }) => {
    if (!text?.trim()) return;
    if (active.isGroup) {
      const res = await axiosInstance.post(`/group/message/${active._id}`, {
        senderId: me._id,
        text,
      });
      const last = Array.isArray(res.data)
        ? res.data[res.data.length - 1]
        : null;
      setMessages((prev) => [...prev, last || { text, sender: me._id }]);
    } else {
      const res = await axiosInstance.post(`/messages/send`, {
        sender: me._id,
        recipient: active.peer._id,
        text,
      });
      setMessages((prev) => [...prev, res.data]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-100">
      <div className="w-full md:w-80 border-r bg-white">
        <ConversationsList
          threads={threads}
          activeId={active?._id}
          onSelect={setActive}
        />
      </div>
      <div className="flex-1">
        <ChatWindow
          me={me}
          thread={active}
          messages={messages}
          onSend={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
}
