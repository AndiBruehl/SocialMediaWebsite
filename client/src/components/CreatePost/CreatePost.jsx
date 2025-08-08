import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "../../assets/avatar.webp";
import {
  MdLabel,
  MdPermMedia,
  MdEmojiEmotions,
  MdLocationPin,
} from "react-icons/md";
import axiosInstance from "../../utils/api/axiosInstance";

const API_BASE = "http://localhost:9000"; // ggf. anpassen

function buildAvatarUrl(profilePicture) {
  if (!profilePicture || !String(profilePicture).trim()) return defaultAvatar;
  const isAbsolute = /^https?:\/\//i.test(profilePicture);
  return isAbsolute ? profilePicture : `${API_BASE}${profilePicture}`;
}

const CreatePost = () => {
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
  const [loading, setLoading] = useState(false);

  const avatarSrc = buildAvatarUrl(user?.profilePicture);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_POST_PRESET
    );

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName || !formData.get("upload_preset")) {
      throw new Error("Cloudinary ENV Variablen fehlen!");
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error?.message || "Upload fehlgeschlagen");
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!desc.trim() && !file) {
      toast.error("Bitte Text oder Bild hinzufügen.");
      return;
    }
    if (!user?._id) {
      toast.error("User nicht gefunden!");
      return;
    }

    setLoading(true);
    try {
      let imgUrl = "";
      if (file) {
        imgUrl = await uploadToCloudinary(file);
      }

      await axiosInstance.post("/post/create", {
        userId: user._id,
        desc: desc.trim(),
        img: imgUrl, // <-- wichtig: img statt photo
      });

      setDesc("");
      setFile(null);
      toast.success("Post erstellt ✅");
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 Sekunden nach Toast neu laden
    } catch (err) {
      console.error("Post create failed:", err);
      toast.error("Post konnte nicht erstellt werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[97%] shadow-lg rounded-lg bg-slate-50">
      <div className="p-3 sm:p-4">
        {/* Top */}
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user?._id || ""}`}>
            <img
              src={avatarSrc}
              alt="profile avatar"
              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-600 hover:ring-2 hover:ring-blue-500 transition"
            />
          </Link>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="flex-1 bg-transparent border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File preview */}
        {file && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-60 rounded-lg object-contain border"
            />
          </div>
        )}

        <hr className="my-3 border-slate-200 dark:border-slate-700" />

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
            <MdPermMedia /> <span>Media</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          {/* <button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MdLabel /> <span>Tags</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MdEmojiEmotions /> <span>Emoji</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MdLocationPin /> <span>Area</span>
          </button> */}
          <div className="ml-auto">
            <button
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
};

export default CreatePost;
