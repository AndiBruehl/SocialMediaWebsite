import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { MdOutlineMoreVert } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import avatarFallback from "../../assets/avatar.webp";

const API_BASE = "http://localhost:9000";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const resolveUrl = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

const Post = ({ post }) => {
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

  const [user, setUser] = useState({});
  const [likes, setLikes] = useState(
    Array.isArray(post.likes) ? post.likes : []
  );
  const [working, setWorking] = useState(false);

  // menu / edit state
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(post.desc || "");
  const menuRef = useRef(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!post.userId) return;
      try {
        const res = await axiosInstance.get(`/users/${post.userId}`);
        setUser(res.data.userInfo || {});
      } catch (error) {
        console.log("Fehler beim Laden des Users:", error);
      }
    };
    getUserInfo();
  }, [post.userId]);

  const isLikedByMe = useMemo(() => {
    return me?._id ? likes.map(String).includes(String(me._id)) : false;
  }, [likes, me?._id]);

  const handleLike = async () => {
    if (!me?._id || working) return;
    setWorking(true);
    try {
      const res = await axiosInstance.put(`/post/like/${post._id}`, {
        userId: me._id,
      });
      if (Array.isArray(res.data.likes)) setLikes(res.data.likes);
    } catch (e) {
      console.error("Like fehlgeschlagen:", e?.response?.data || e.message);
    } finally {
      setWorking(false);
    }
  };

  // click outside for menu
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const canEdit = String(me?._id) === String(post.userId) || me?.isAdmin;

  const handleSaveEdit = async () => {
    if (!canEdit) return;
    try {
      await axiosInstance.put(`/post/update/${post._id}`, {
        userId: me._id,
        desc: editDesc,
      });
      setEditing(false);
      setMenuOpen(false);
      // weiche Aktualisierung:
      post.desc = editDesc;
    } catch (e) {
      console.error(
        "Post-Update fehlgeschlagen:",
        e?.response?.data || e.message
      );
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;
    if (!confirm("Diesen Post wirklich löschen?")) return;
    try {
      await axiosInstance.delete(`/post/delete/${post._id}`);
      // simple Lösung: Seite neu laden, oder du entfernst das Item aus dem Feed-State
      window.location.reload();
    } catch (e) {
      console.error(
        "Post löschen fehlgeschlagen:",
        e?.response?.data || e.message
      );
    }
  };

  const avatar = resolveUrl(user?.profilePicture) || avatarFallback;
  const postImg = resolveUrl(post?.img);

  return (
    <div className="w-[97%] mb-20 shadow-lg rounded-md bg-slate-50">
      <div className="p-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              className="cursor-pointer flex flex-row items-center group relative"
              to={`/profile/${post.userId}`}
              title={`Visit ${user.username ?? "User"}’s Profile`}
            >
              <img
                src={avatar}
                alt="profilePic"
                className="w-[25px] h-[25px] rounded-full m-2 object-cover"
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />
              {user.username && (
                <span className="font-bold mr-2.5">{user.username}</span>
              )}
            </Link>
            <span className="text-xs text-gray-500">
              {post?.createdAt
                ? formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })
                : ""}
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              className="text-xl p-1 rounded hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              title="Optionen"
            >
              <MdOutlineMoreVert />
            </button>

            {menuOpen && canEdit && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 w-44">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setEditing(true);
                    setMenuOpen(false);
                  }}
                >
                  Post bearbeiten
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600"
                  onClick={handleDelete}
                >
                  Post löschen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inhalt */}
      <div className="mt-[20px] mb-[20px]">
        {!editing ? (
          <>
            {post?.desc && <span className="p-5 block">{post.desc}</span>}
            {postImg && (
              <div>
                <img
                  src={postImg}
                  alt="post"
                  className="mt-[10px] mb-[10px] w-full p-5 object-contain"
                  style={{ maxHeight: "500px" }}
                  loading="lazy"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                />
              </div>
            )}
          </>
        ) : (
          <div className="p-4">
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Speichern
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 rounded border"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] ml-[5%] mb-[2%] ">
          <BiSolidLike
            className={`cursor-pointer ${isLikedByMe ? "text-blue-600" : ""}`}
            onClick={handleLike}
            title={isLikedByMe ? "Unlike" : "Like"}
          />
          <span className="text-sm">{likes.length} like/s</span>
        </div>

        <div className="flex items-center gap-[5px] mr-[5%] mb-[2%]">
          <Link
            to={`/post/${post._id}`}
            className="text-sm border-b-black border-b-[1px] hover:opacity-80"
          >
            {Array.isArray(post.comments) ? post.comments.length : 0} comments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
