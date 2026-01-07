import { useContext, useEffect, useMemo, useState } from "react";
import Links from "./Links";
import FriendsList from "./Friends";
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

  // Hilfsfunktion: einzelne User laden
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
        // User-Details holen
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
    <aside className="fixed top-0 left-0 h-screen w-[25%] lg:w-[300px] bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 z-50 hidden md:flex flex-col p-4 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto">
        <Links />

        {/* Separator instead of <br /> */}
        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <ul className="m-0 p-0 list-none">
          {loading ? (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              Lade gefolgte Nutzer…
            </li>
          ) : followingUsers.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
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
