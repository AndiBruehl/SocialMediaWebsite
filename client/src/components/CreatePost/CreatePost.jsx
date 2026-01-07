// client/src/components/CreatePost/CreatePost.jsx
import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/avatar.webp";
import { MdPermMedia, MdLocationPin } from "react-icons/md";
import axiosInstance from "../../utils/api/axiosInstance";
import { toast } from "react-toastify";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const resolveUrl = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", import.meta.env.VITE_CLOUDINARY_POST_PRESET);
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    {
      method: "POST",
      body: fd,
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
};

export default function CreatePost() {
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
  const user = currentUser || lsUser;

  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatar = resolveUrl(user?.profilePicture) || defaultAvatar;

  const handleSubmit = async () => {
    if (!user?._id) {
      toast.error("You are not logged in.");
      return;
    }
    if (!desc.trim() && !file) {
      toast.info("Write something or choose a picture...");
      return;
    }

    setLoading(true);
    try {
      let imgUrl = "";
      if (file) imgUrl = await uploadToCloudinary(file);

      await axiosInstance.post("/post/create", {
        userId: user._id,
        desc: desc.trim(),
        img: imgUrl,
        location: location.trim(),
      });

      // Felder zurücksetzen
      setDesc("");
      setFile(null);
      setLocation("");
      setShowLocation(false);

      // ✅ Erfolg-Toast + Auto-Reload nach Ablauf
      toast.success("Post created successfully!", {
        autoClose: 1800,
        onClose: () => window.location.reload(),
      });
    } catch (e) {
      console.error("Post create failed:", e?.response?.data || e.message);
      toast.error(
        e?.response?.data?.message || "Creating failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[97%] shadow-lg rounded-lg bg-slate-50">
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user?._id || ""}`}>
            <img
              src={avatar}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border"
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
            />
          </Link>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="flex-1 bg-transparent border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {file && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-60 rounded-lg object-contain border"
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
            />
          </div>
        )}

        {showLocation && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Add a location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <hr className="my-3" />

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
            <MdPermMedia /> <span>Media</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            type="button"
            onClick={() => setShowLocation((s) => !s)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MdLocationPin /> <span>Location</span>
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Posting..." : "POST!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
