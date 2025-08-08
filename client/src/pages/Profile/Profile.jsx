import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { RightPanelProfile } from "../../components/RightPanel/RightPanel";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/avatar.webp";

const API_BASE = "http://localhost:9000";
const resolveImageUrl = (src) => {
  if (!src || typeof src !== "string" || !src.trim()) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${API_BASE}${src}`;
};

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext) || {};
  const [user, setUser] = useState(null);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        setUser(res.data.userInfo);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile…</p>
      </div>
    );
  }

  const coverUrl = resolveImageUrl(user.coverPicture);
  const avatarUrl = resolveImageUrl(user.profilePicture) || defaultAvatar;

  const isOwnProfile =
    currentUser && String(currentUser._id) === String(user._id || userId);

  return (
    <div className="flex flex-col">
      {/* Cover + Profile Picture */}
      <div style={{ flex: 9, backgroundColor: "white" }}>
        <div className="relative h-[200px] bg-gray-100">
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
            className="h-[100px] w-[100px] object-cover rounded-full absolute left-0 right-0 m-auto top-[150px] border-4 border-white shadow-md"
          />
        </div>

        {/* Username + Bio + Actions */}
        <div className="flex flex-col items-center mt-[75px] mx-[2%]">
          <h1 className="font-bold text-2xl">
            {user.username || "Unknown user"}
          </h1>
          <span className="text-sm text-gray-600 mb-4">
            {typeof user.desc === "string" && user.desc.trim()
              ? user.desc
              : "No bio available"}
          </span>

          {/* Nachricht senden nur anzeigen, wenn fremdes Profil */}
          {!isOwnProfile && (
            <button
              type="button"
              onClick={() => navigate(`/messages/${user._id || userId}`)}
              className="px-4 py-2 mb-5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Nachricht senden
            </button>
          )}
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
