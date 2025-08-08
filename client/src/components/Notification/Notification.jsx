// client/src/components/Notification/Notification.jsx
import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/api/axiosInstance";
import defaultAvatar from "../../assets/avatar.webp";

const API_BASE = "http://localhost:9000";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const resolveUrl = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

const Notification = () => {
  const { currentUser } = useContext(AuthContext) || {};
  const lsUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.user || parsed || null;
    } catch {
      return null;
    }
  }, []);
  const me = currentUser || lsUser;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  const fetchUnread = async () => {
    if (!me?._id) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/notifications/unread/${me._id}`);
      setItems(res.data.notifications || []);
    } catch (e) {
      console.error("Fetch notifications failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // Polling
  useEffect(() => {
    fetchUnread();
    const t = setInterval(fetchUnread, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?._id]);

  // Click outside → schließen
  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const badge = items.length;

  const markAllRead = async () => {
    if (!me?._id) return;
    try {
      await axiosInstance.put(`/notifications/read-all/${me._id}`);
      setItems([]);
      setOpen(false);
    } catch (e) {
      console.error("markAllRead failed:", e);
    }
  };

  const handleToggle = () => setOpen((o) => !o);

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        className="relative"
        onClick={handleToggle}
        title="Notifications"
      >
        <BiBell className="icon-size" />
        {badge > 0 && <span className="notification-badge">{badge}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <h4 className="font-semibold">Benachrichtigungen</h4>
            <button
              onClick={markAllRead}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
              disabled={loading || items.length === 0}
            >
              Alle gelesen
            </button>
          </div>

          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Laden…</div>
            ) : items.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                Keine neuen Benachrichtigungen.
              </div>
            ) : (
              items.map((n) => {
                const actor = n.actorId || {};
                const avatar =
                  resolveUrl(actor.profilePicture) || defaultAvatar;
                const verb =
                  n.type === "like"
                    ? "hat deinen Post geliked"
                    : "hat deinen Post kommentiert";
                return (
                  <div
                    key={n._id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                  >
                    <img
                      src={avatar}
                      alt="actor"
                      className="w-8 h-8 rounded-full object-cover"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable="false"
                    />
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-semibold">
                          {actor.username || "Jemand"}
                        </span>{" "}
                        {verb}.
                      </div>
                      <div className="text-xs text-gray-500">
                        {/* optional: relative Zeit hier */}
                      </div>
                    </div>
                    <Link
                      to={`/post/${n.postId._id || n.postId}`} // ID auslesen, egal ob String oder Objekt
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Öffnen
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
