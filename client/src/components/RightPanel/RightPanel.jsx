import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GrAnnounce } from "react-icons/gr";
import adImage from "../../assets/ad.png";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/api/axiosInstance";
import { io } from "socket.io-client";
import defaultAvatar from "../../assets/avatar.webp";

console.log("RightPanel loaded");

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

// kleine Zeile pro Online-User
function OnlineRow({ user }) {
  const avatar = url(user?.profilePicture) || defaultAvatar;
  return (
    <Link
      to={`/profile/${user?._id}`}
      className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10"
      title={`Zu ${user?.username} wechseln`}
    >
      <img
        src={avatar}
        alt={user?.username || "avatar"}
        className="w-8 h-8 rounded-full object-cover border border-white/30"
        onContextMenu={(e) => e.preventDefault()}
        draggable="false"
      />
      <div className="flex-1">
        <div className="text-sm font-medium">
          {user?.username || "Unbekannt"}
        </div>
        <div className="text-[11px] text-white/80">online</div>
      </div>
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400" />
    </Link>
  );
}

// === Home Panel: echte Online-User
export const RightPanelHome = () => {
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

  const socketRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineIds, setOnlineIds] = useState(new Set());
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Socket verbinden
  useEffect(() => {
    if (!me?._id) return;
    const s = io(API_BASE, {
      transports: ["websocket"],
      query: { userId: me._id },
    });
    socketRef.current = s;

    const log = (...a) => console.debug("[presence]", ...a);

    const onList = (ids) => {
      log("list", ids);
      setOnlineIds(new Set((ids || []).map(String)));
    };
    const onOnline = (id) => {
      log("online", id);
      setOnlineIds((prev) => new Set([...prev, String(id)]));
    };
    const onOffline = (id) => {
      log("offline", id);
      setOnlineIds((prev) => {
        const next = new Set(prev);
        next.delete(String(id));
        return next;
      });
    };

    s.on("presence:list", onList);
    s.on("presence:online", onOnline);
    s.on("presence:offline", onOffline);

    // falls Server sofort nicht pusht:
    s.emit("presence:hello");

    return () => {
      s.off("presence:list", onList);
      s.off("presence:online", onOnline);
      s.off("presence:offline", onOffline);
      s.disconnect();
      socketRef.current = null;
    };
  }, [me?._id]);

  // Alle User einmal laden
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get("/users");
        const list = Array.isArray(res.data) ? res.data : res.data?.users || [];
        if (mounted) setAllUsers(list);
      } catch (e) {
        console.error(
          "Userliste laden fehlgeschlagen:",
          e?.response?.data || e.message
        );
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const onlineUsers = useMemo(() => {
    const meId = String(me?._id || "");
    return allUsers
      .filter((u) => onlineIds.has(String(u._id)) && String(u._id) !== meId)
      .sort((a, b) => (a.username || "").localeCompare(b.username || ""));
  }, [allUsers, onlineIds, me?._id]);

  return (
    <div
      style={{
        flex: 2,
        height: "100vh - 80px",
        marginLeft: "2%",
        maxWidth: "300px",
      }}
      className="bg-slate-400 p-5 rounded-[15px] text-white"
    >
      <div className="pt-[20px] pr-[20px] space-y-6">
        {/* kleines Widget */}
        <div className="flex items-center justify-center">
          <GrAnnounce className="w-[50px] h-[50px] mr-[10px]" />
          <span className="text-xs">
            <b>Current</b> Announcements:
          </span>
        </div>

        <img src={adImage} alt="Ad" className="w-full rounded-lg" />

        <div>
          <h1 className="font-bold text-lg mb-3">ONLINE</h1>
          {loadingUsers ? (
            <div className="text-sm text-white/80">Loading users...</div>
          ) : onlineUsers.length === 0 ? (
            <div className="text-sm text-white/80">
              No one else is online at the moment.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {onlineUsers.map((u) => (
                <OnlineRow key={u._id} user={u} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// === Profil-Panel: echte Follower anzeigen
export const RightPanelProfile = ({ user }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const relationshipMap = {
    1: "Single",
    2: "In a relationship",
    3: "Married",
    4: "It's complicated",
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ids = Array.isArray(user?.followers) ? user.followers : [];
        if (ids.length === 0) {
          if (mounted) setFollowers([]);
          return;
        }

        // Ohne dedizierte /users/byIds Route rufen wir nacheinander (einfach & robust)
        const results = await Promise.allSettled(
          ids.map((id) => axiosInstance.get(`/users/${id}`))
        );
        const list = results
          .map((r) =>
            r.status === "fulfilled"
              ? r.value.data?.userInfo || r.value.data
              : null
          )
          .filter(Boolean);

        if (mounted) setFollowers(list);
      } catch (e) {
        console.error(
          "Follower laden fehlgeschlagen:",
          e?.response?.data || e.message
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [user?._id, user?.followers]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading profile details…</p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 2,
        height: "100vh - 80px",
        marginLeft: "2%",
        maxWidth: "300px",
        textAlign: "end",
      }}
      className="bg-slate-400 shadow-md p-5 rounded-[15px] text-white"
    >
      <h1 className="font-bold text-xl mb-[20px]">User Info</h1>

      <div className="mb-[30px]">
        <div className="mb-[10px]">
          <span className="font-semibold mr-[15px] text-blue-900">City:</span>
          <span>{user.city || user.location || "Not specified"}</span>
        </div>
        <div className="mb-[10px]">
          <span className="font-semibold mr-[15px] text-blue-900">From:</span>
          <span>{user.from || "Not specified"}</span>
        </div>
        <div className="mb-[10px]">
          <span className="font-semibold mr-[15px] text-blue-900">
            Relationship:
          </span>
          <span>{relationshipMap[user.relationship] || "Unknown"}</span>
        </div>
      </div>

      <h1 className="font-bold text-xl mt-[50px] mb-[12px] text-left">
        Follower
      </h1>
      {loading ? (
        <div className="text-sm text-white/80 text-left">Loading follower…</div>
      ) : followers.length === 0 ? (
        <div className="text-sm text-white/80 text-left">
          You don't have any follower yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-left">
          {followers.map((f) => {
            const avatar = url(f?.profilePicture) || defaultAvatar;
            return (
              <Link
                key={f._id}
                to={`/profile/${f._id}`}
                className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10"
                title={`Zu ${f.username}`}
              >
                <img
                  src={avatar}
                  alt={f.username}
                  className="w-8 h-8 rounded-full object-cover border border-white/30"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
                <span className="text-sm">{f.username}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
