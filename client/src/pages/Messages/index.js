import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/api/axiosInstance";
import ConversationsList from "./ConversationsList";
import ChatWindow from "../../components/Messages/ChatWindow";
import { useSocket } from "../../context/SocketContext";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

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
      try {
        const res = await axiosInstance.get(
          `/messages/conversations/${me._id}`
        );
        setThreads(res.data?.conversations || []);
        if (!active && res.data?.conversations?.length) {
          setActive(res.data.conversations[0]);
        }
      } catch (e) {
        console.error("Failed to load conversations", e);
      }
    })();
  }, [me?._id, active]); // Added active dependency to prevent overriding selection if needed

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
      } catch (e) {
        console.error("Failed to load messages", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [active, me?._id]);

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

  // Fixed: Accept text string directly instead of object
  const handleSend = async (text) => {
    if (!text?.trim()) return;

    try {
      if (active.isGroup) {
        const res = await axiosInstance.post(`/group/message/${active._id}`, {
          senderId: me._id,
          text,
        });
        const last = Array.isArray(res.data)
          ? res.data[res.data.length - 1]
          : res.data;
        setMessages((prev) => [...prev, last || { text, sender: me._id }]);
      } else {
        const res = await axiosInstance.post(`/messages/send`, {
          sender: me._id,
          recipient: active.peer._id,
          text,
        });
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <ConversationsList
          threads={threads}
          activeId={active?._id}
          onSelect={setActive}
        />
      </div>
      <div className="flex-1 bg-white dark:bg-gray-900">
        <ChatWindow
          title={
            active?.isGroup ? active.name : active?.peer?.username || "Unknown"
          }
          avatar={
            active?.isGroup
              ? active.avatar
              : url(active?.peer?.profilePicture) || "/default-avatar.png"
          }
          messages={messages}
          meId={me?._id}
          onSend={handleSend}
          sending={loading}
        />
      </div>
    </div>
  );
}
