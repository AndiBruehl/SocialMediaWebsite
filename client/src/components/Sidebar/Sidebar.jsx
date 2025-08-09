import { useContext, useEffect, useMemo, useState } from "react";
import Links from "./Links";
import FriendsList from "./Friends"; // <- dein neues FriendsList, das { user } erwartet
import "./SidebarHover.css";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/api/axiosInstance";

export default function Sidebar() {
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

  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hilfsfunktion: einzelne User laden (falls following nur IDs enthält)
  const fetchUser = async (id) => {
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      return res.data?.userInfo || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadFollowing = async () => {
      if (!me?._id) {
        setLoading(false);
        return;
      }

      try {
        // Falls dein /users/:id bereits "following" **populiert** zurückgibt,
        // reicht ein Request:
        const res = await axiosInstance.get(`/users/${me._id}`);
        const userInfo = res.data?.userInfo || {};
        let list = userInfo.following || [];

        // Wenn "following" nur Strings/IDs sind -> Details nachladen:
        if (list.length && typeof list[0] === "string") {
          const detailed = await Promise.all(list.map((id) => fetchUser(id)));
          list = detailed.filter(Boolean);
        }

        if (mounted) setFollowingUsers(list);
      } catch (e) {
        console.error(
          "Following laden fehlgeschlagen:",
          e?.response?.data || e.message
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFollowing();
    return () => {
      mounted = false;
    };
  }, [me?._id]);

  return (
    <aside className="sidebar-wrapper">
      <div className="sidebar-content">
        <Links />
        <br />

        <ul className="m-0 p-0">
          {loading ? (
            <li className="px-3 py-2 text-sm text-gray-400">
              Lade gefolgte Nutzer…
            </li>
          ) : followingUsers.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">
              Du folgst noch niemandem.
            </li>
          ) : (
            followingUsers.map((u) => (
              <FriendsList key={u._id || u.id} user={u} />
            ))
          )}
        </ul>

        <div className="h-8" />
      </div>
    </aside>
  );
}
