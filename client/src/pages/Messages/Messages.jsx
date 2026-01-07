import React, { useEffect, useMemo, useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

export default function Messages() {
  const { currentUser } = useContext(AuthContext) || {};
  const me = useMemo(() => {
    if (currentUser) return currentUser;
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.user || parsed || null;
    } catch {
      return null;
    }
  }, [currentUser]);

  const { peerId: peerIdParam } = useParams();
  const navigate = useNavigate();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [resolvingPeer, setResolvingPeer] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [activeThread, setActiveThread] = useState(null); // reserved for future "thread list"
  const [draftPeer, setDraftPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  // Socket
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!me?._id) return;
    const s = io(API_BASE, {
      transports: ["websocket"],
      query: { userId: me._id },
    });
    setSocket(s);
    return () => s.disconnect();
  }, [me?._id]);

  // De-dup set for incoming messages by _id
  const seenIdsRef = useRef(new Set());

  // Users list for left panel
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get("/users");
        const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
        const filtered = me?._id
          ? list.filter((u) => String(u._id) !== String(me._id))
          : list;
        if (mounted) setAllUsers(filtered);
      } catch (e) {
        console.error(
          "Failed loading user list:",
          e?.response?.data || e.message
        );
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => (mounted = false);
  }, [me?._id]);

  // Deep-link: /messages/:peerId — resolve peer + load history
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!peerIdParam || !me?._id) return;

      // prevent self DM
      if (String(peerIdParam) === String(me._id)) {
        if (!cancelled) {
          setDraftPeer(null);
          setActiveThread(null);
          setMessages([]);
        }
        return;
      }

      setResolvingPeer(true);

      // try list
      let user = allUsers.find((u) => String(u._id) === String(peerIdParam));

      // fetch directly if not in list
      if (!user) {
        try {
          const res = await axiosInstance.get(`/users/${peerIdParam}`);
          user = res.data?.userInfo || res.data || null;
        } catch (e) {
          console.error("Peer loading failed:", e?.response?.data || e.message);
        }
      }

      if (user && !cancelled) {
        setActiveThread(null);
        setDraftPeer(user);
        setMessages([]);
        seenIdsRef.current.clear();

        // load existing conversation history (persisted!)
        try {
          const resp = await axiosInstance.get(
            `/messages/conversation/${me._id}/${user._id}`
          );
          const hist = Array.isArray(resp.data) ? resp.data : [];
          // seed dedupe set
          hist.forEach((m) => m?._id && seenIdsRef.current.add(String(m._id)));
          setMessages(hist);
        } catch (e) {
          console.error(
            "loading history failed:",
            e?.response?.data || e.message
          );
        }
      }

      if (!cancelled) setResolvingPeer(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [peerIdParam, allUsers, me?._id]);

  // Socket receiver — append only if new (_id not seen)
  useEffect(() => {
    if (!socket) return;
    const onNewMessage = (msg) => {
      if (!msg || !msg._id) return;
      // only if this message is between me and the currently open draftPeer
      const meId = String(me?._id || "");
      const draftId = String(draftPeer?._id || "");
      const isForDraft =
        draftPeer &&
        ((String(msg.sender?._id || msg.sender) === meId &&
          String(msg.recipient?._id || msg.recipient) === draftId) ||
          (String(msg.sender?._id || msg.sender) === draftId &&
            String(msg.recipient?._id || msg.recipient) === meId));

      if (!isForDraft) return;

      const key = String(msg._id);
      if (seenIdsRef.current.has(key)) return; // already have it
      seenIdsRef.current.add(key);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [socket, draftPeer, me?._id]);

  const startDraftWith = (user) => {
    if (!user) return;
    if (me?._id && String(user._id) === String(me._id)) return;
    setActiveThread(null);
    setDraftPeer(user);
    setMessages([]);
    seenIdsRef.current.clear();
    if (String(peerIdParam) !== String(user._id)) {
      navigate(`/messages/${user._id}`, { replace: false });
    }
  };

  const handleSend = async (text) => {
    const bodyText = (text || "").trim();
    if (!bodyText || !me?._id || sending) return;
    setSending(true);
    try {
      if (draftPeer) {
        const body = {
          sender: me._id,
          recipient: draftPeer._id,
          text: bodyText,
        };
        const resp = await axiosInstance.post("/messages/send", body);
        const saved = resp.data || resp;

        // De-dupe: add only if socket didn’t already append it
        const key = String(saved?._id || "");
        if (key && !seenIdsRef.current.has(key)) {
          seenIdsRef.current.add(key);
          setMessages((prev) => [...prev, saved]);
        }
      } else if (activeThread) {
        // Not used yet, but left for group/threads later
      }
    } catch (e) {
      console.error("failed sending:", e?.response?.data || e.message);
    } finally {
      setSending(false);
    }
  };

  // LEFT
  const leftPanel = (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-3 font-semibold border-b">Start a conversation.</div>
      {loadingUsers ? (
        <div className="p-3 text-sm text-gray-500">Loading...</div>
      ) : allUsers.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">No other users found.</div>
      ) : (
        <ul>
          {allUsers.map((u) => (
            <li key={u._id} className="flex items-center gap-3 p-3 border-b">
              <img
                src={url(u.profilePicture) || "/default-avatar.png"}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />
              <div className="flex-1">
                <div className="font-medium">{u.username}</div>
                <button
                  onClick={() => startDraftWith(u)}
                  className="mt-1 px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-500"
                >
                  Send a message
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0 bg-gray-100">
      {/* Left */}
      <div className="bg-white border-r">{leftPanel}</div>

      {/* Right */}
      <div className="bg-gray-100">
        {resolvingPeer ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading conversations…
          </div>
        ) : !draftPeer && !activeThread ? (
          <div className="h-full flex items-center justify-center text-blue-900">
            No conversation selected
          </div>
        ) : draftPeer ? (
          <ChatWindow
            title={draftPeer.username || "Unknown"}
            avatar={url(draftPeer.profilePicture)}
            messages={messages}
            meId={me?._id}
            onSend={handleSend}
            sending={sending}
          />
        ) : (
          activeThread && (
            <ChatWindow
              title={
                activeThread.isGroup
                  ? activeThread.name || "Group"
                  : activeThread.peer?.username || "Unknown"
              }
              avatar={
                activeThread.isGroup
                  ? activeThread.avatar
                  : url(activeThread.peer?.profilePicture)
              }
              messages={messages}
              meId={me?._id}
              onSend={handleSend}
              sending={sending}
            />
          )
        )}
      </div>
    </div>
  );
}
