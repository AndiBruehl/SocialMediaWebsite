// client/src/pages/Profile/Profile.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { RightPanelProfile } from "../../components/RightPanel/RightPanel";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/avatar.webp";
import { toast } from "react-toastify";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const resolveImageUrl = (src) => {
  if (!src || typeof src !== "string" || !src.trim()) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${API_BASE}${src}`;
};

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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

  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => window.scrollTo(0, 0), []);

  // Profil laden
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        const u = res.data.userInfo;
        setUser(u);
        setFollowersCount(Array.isArray(u?.followers) ? u.followers.length : 0);
        // Follows-Status lokal bestimmen (Strings vergleichen)
        if (me?._id && Array.isArray(me.following)) {
          setIsFollowing(
            me.following.map(String).includes(String(u._id || userId))
          );
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("Error loading profile.");
      }
    };
    fetchUser();
  }, [userId, me?._id, me?.following]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <p>Loading profile…</p>
      </div>
    );
  }

  const coverUrl = resolveImageUrl(user.coverPicture);
  const avatarUrl = resolveImageUrl(user.profilePicture) || defaultAvatar;

  const isOwnProfile = me && String(me._id) === String(user._id || userId);

  const applyLocalFollowingChange = (follow) => {
    // followers-Zahl im angezeigten Profil aktualisieren
    setFollowersCount((c) => (follow ? c + 1 : Math.max(0, c - 1)));
    setIsFollowing(follow);

    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      const stored = parsed?.user || parsed || null;
      if (stored && Array.isArray(stored.following)) {
        const idStr = String(user._id);
        const exists = stored.following.map(String).includes(idStr);
        let nextFollowing = stored.following.slice();
        if (follow && !exists) nextFollowing.push(idStr);
        if (!follow && exists)
          nextFollowing = nextFollowing.filter((x) => String(x) !== idStr);
        const next = {
          ...parsed,
          user: { ...(parsed?.user || stored), following: nextFollowing },
        };
        localStorage.setItem("user", JSON.stringify(next));
      }
    } catch {
      /* ignore */
    }
  };

  const handleFollow = async () => {
    if (!me?._id || busy) return;
    setBusy(true);
    try {
      await axiosInstance.put(`/users/${user._id}/follow`, { userId: me._id });
      applyLocalFollowingChange(true);
      toast.success(`You are now following ${user.username}`);
    } catch (e) {
      console.error("Follow failed:", e?.response?.data || e.message);
      toast.error("Follow failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleUnfollow = async () => {
    if (!me?._id || busy) return;
    setBusy(true);
    try {
      await axiosInstance.put(`/users/${user._id}/unfollow`, {
        userId: me._id,
      });
      applyLocalFollowingChange(false);
      toast.success(`You are not following ${user.username} anymore.`);
    } catch (e) {
      console.error("Unfollow failed:", e?.response?.data || e.message);
      toast.error("Unfollow failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Cover + Profile Picture - CHANGED TO CLASSES ONLY */}
      <div className="flex-[9] bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="relative h-[200px] bg-gray-200 dark:bg-gray-800">
          {coverUrl && (
            <img
              src={coverUrl}
              alt="Cover"
              className="w-full h-[200px] object-cover"
              loading="lazy"
            />
          )}
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-[100px] w-[100px] object-cover rounded-full absolute left-0 right-0 m-auto top-[150px] border-4 border-white dark:border-gray-900 shadow-md"
          />
        </div>

        {/* Username + Bio + Actions */}
        <div className="flex flex-col items-center mt-[75px] mx-[2%]">
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
            {user.username || "Unknown user"}
          </h1>
          <span className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {typeof user.desc === "string" && user.desc.trim()
              ? user.desc
              : "No bio available"}
          </span>

          {/* Followers-Zähler (optional) */}
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {followersCount} Follower
          </span>

          {/* Buttons */}
          <div className="flex items-center gap-2 mb-5">
            {!isOwnProfile && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/messages/${user._id || userId}`)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  Send a message...
                </button>

                {/* Follow/Unfollow */}
                {isFollowing ? (
                  <button
                    type="button"
                    onClick={handleUnfollow}
                    disabled={busy}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFollow}
                    disabled={busy}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-50"
                  >
                    Follow
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Feed + Right Panel */}
      <div className="flex mt-[3%]">
        <NewsFeed userId={userId} userPosts />
        <RightPanelProfile user={user} />
      </div>
    </div>
  );
};

export default Profile;
