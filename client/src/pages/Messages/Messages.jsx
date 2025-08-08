import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import ChatWindow from "./ChatWindow";

const API_BASE = "http://localhost:9000";
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

  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [draftPeer, setDraftPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);

  // socket
  useEffect(() => {
    if (!me?._id) return;
    const s = io(API_BASE, {
      transports: ["websocket"],
      query: { userId: me._id },
    });
    setSocket(s);
    return () => s.disconnect();
  }, [me?._id]);

  // users
  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
        const filtered = me?._id
          ? list.filter((u) => String(u._id) !== String(me._id))
          : list;
        if (mounted) setAllUsers(filtered);
      } catch (e) {
        console.error(
          "User-Liste laden fehlgeschlagen:",
          e?.response?.data || e.message
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadUsers();
    return () => (mounted = false);
  }, [me?._id]);

  // deep-link: /messages/:peerId → try list, else fetch directly
  useEffect(() => {
    let cancelled = false;
    const resolvePeer = async () => {
      if (!peerIdParam) return;

      // 1) block self
      if (me?._id && String(peerIdParam) === String(me._id)) {
        setDraftPeer(null);
        setActiveThread(null);
        setMessages([]);
        return;
      }

      // 2) try from already-loaded list
      const found = allUsers.find((u) => String(u._id) === String(peerIdParam));
      if (found) {
        if (!cancelled) {
          setActiveThread(null);
          setMessages([]);
          setDraftPeer(found);
        }
        return;
      }

      // 3) fetch directly (works even if list is empty/filtered)
      try {
        const res = await axiosInstance.get(`/users/${peerIdParam}`);
        const u = res.data?.userInfo || res.data || null;
        if (u && !cancelled) {
          setActiveThread(null);
          setMessages([]);
          setDraftPeer(u);
        }
      } catch (e) {
        console.error(
          "Peer laden fehlgeschlagen:",
          e?.response?.data || e.message
        );
      }
    };

    resolvePeer();
    return () => {
      cancelled = true;
    };
  }, [peerIdParam, allUsers, me?._id]);

  // socket receive
  useEffect(() => {
    if (!socket) return;
    const onNewMessage = (msg) => {
      const meId = String(me?._id || "");
      const isDraft =
        draftPeer &&
        ((String(msg.sender) === String(draftPeer._id) &&
          String(msg.recipient) === meId) ||
          (String(msg.sender) === meId &&
            String(msg.recipient) === String(draftPeer._id)));

      const isThread =
        activeThread &&
        Array.isArray(activeThread.participants) &&
        activeThread.participants.some(
          (p) => String(p._id || p) === String(msg.sender)
        ) &&
        activeThread.participants.some(
          (p) => String(p._id || p) === String(msg.recipient)
        );

      if (isDraft || isThread) setMessages((prev) => [...prev, msg]);
    };
    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [socket, draftPeer, activeThread, me?._id]);

  const startDraftWith = (user) => {
    if (!user) return;
    if (me?._id && String(user._id) === String(me._id)) return; // no self-DM
    setActiveThread(null);
    setMessages([]);
    setDraftPeer(user);
    if (String(peerIdParam) !== String(user._id)) {
      navigate(`/messages/${user._id}`, { replace: false });
    }
  };

  const handleSend = async (text) => {
    const bodyText = text.trim();
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
        const sent = resp.data || resp;
        setMessages((prev) => [...prev, sent]);
      } else if (activeThread) {
        const meId = me._id;
        const peer =
          activeThread.peer ||
          activeThread.participants.find(
            (p) => String(p._id || p) !== String(meId)
          );
        if (!peer) return;
        const body = {
          sender: meId,
          recipient: peer._id || peer,
          text: bodyText,
        };
        const resp = await axiosInstance.post("/messages/send", body);
        const sent = resp.data || resp;
        setMessages((prev) => [...prev, sent]);
      }
    } catch (e) {
      console.error("Senden fehlgeschlagen:", e?.response?.data || e.message);
    } finally {
      setSending(false);
    }
  };

  const leftPanel = (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-3 font-semibold border-b">
        Neue Unterhaltung starten
      </div>
      {loading ? (
        <div className="p-3 text-sm text-gray-500">Laden…</div>
      ) : allUsers.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">
          Keine anderen Benutzer gefunden.
        </div>
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
                  Nachricht senden
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
      <div className="bg-white border-r">{leftPanel}</div>
      <div className="bg-gray-100">
        {!draftPeer && !activeThread ? (
          <div className="h-full flex items-center justify-center text-blue-900">
            Keine Konversation ausgewählt
          </div>
        ) : draftPeer ? (
          <ChatWindow
            title={draftPeer.username || "Unbekannt"}
            avatar={url(draftPeer.profilePicture)}
            messages={messages}
            meId={me?._id}
            onSend={handleSend}
            sending={sending}
          />
        ) : (
          <ChatWindow
            title={
              activeThread?.isGroup
                ? activeThread?.name || "Gruppe"
                : activeThread?.peer?.username || "Unbekannt"
            }
            avatar={
              activeThread?.isGroup
                ? activeThread?.avatar
                : url(activeThread?.peer?.profilePicture)
            }
            messages={messages}
            meId={me?._id}
            onSend={handleSend}
            sending={sending}
          />
        )}
      </div>
    </div>
  );
}
