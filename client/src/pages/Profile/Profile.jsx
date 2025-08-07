import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { RightPanelProfile } from "../../components/RightPanel/RightPanel";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import axiosInstance from "../../utils/api/axiosInstance";

import defaultAvatar from "../../assets/avatar.webp";

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { userId } = useParams();
  const [user, setUser] = useState(null);

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

  return (
    <div className="flex flex-col rounded-[25%]">
      {/* Cover + Profile Picture */}
      <div style={{ flex: 9, backgroundColor: "white" }}>
        <div className="relative h-[200px] bg-gray-100">
          {/* Cover Picture */}
          {user.coverPicture?.trim() && (
            <img
              src={`http://localhost:9000${user.coverPicture}`}
              alt="coverImage"
              className="w-full h-[200px] object-cover"
            />
          )}

          {/* Profile Picture */}
          <img
            src={
              user?.profilePicture
                ? `http://localhost:9000${user.profilePicture}`
                : defaultAvatar
            }
            alt="profilePic"
            className="h-[100px] w-[100px] object-cover rounded-full absolute left-0 right-0 m-auto top-[150px] border-4 border-white shadow-md"
          />
        </div>

        {/* Username + Bio */}
        <div className="flex flex-col items-center mt-[75px] mx-[2%]">
          <h1 className="font-bold text-2xl">
            {user.username || "Unknown user"}
          </h1>
          <span className="text-sm text-gray-600 mb-[5%]">
            {typeof user.desc === "string" && user.desc.trim()
              ? user.desc
              : "No bio available"}
          </span>
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
