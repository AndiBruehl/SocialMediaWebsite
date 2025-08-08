import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
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

  const [author, setAuthor] = useState(null);
  const [likes, setLikes] = useState(
    Array.isArray(post?.likes) ? post.likes : []
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [working, setWorking] = useState(false);

  // Autor laden (robust: userId kann String oder Objekt sein)
  useEffect(() => {
    const loadAuthor = async () => {
      try {
        if (!post?.userId) return;
        // Falls bereits populated:
        if (typeof post.userId === "object" && post.userId.username) {
          setAuthor(post.userId);
          return;
        }
        // sonst per ID holen
        const uid =
          typeof post.userId === "string" ? post.userId : post.userId._id;
        const res = await axiosInstance.get(`/users/${uid}`);
        setAuthor(res.data?.userInfo || null);
      } catch {
        setAuthor(null);
      }
    };
    loadAuthor();
  }, [post?.userId]);

  const isLikedByMe = useMemo(() => {
    if (!me?._id) return false;
    const myId = String(me._id);
    return (likes || []).map(String).includes(myId);
  }, [likes, me?._id]);

  const handleLike = async () => {
    if (!me?._id || !post?._id || working) return;
    setWorking(true);
    try {
      const res = await axiosInstance.put(`/post/like/${post._id}`, {
        userId: me._id,
      });
      if (Array.isArray(res.data?.likes)) setLikes(res.data.likes);
    } catch (e) {
      // optional toast
      console.error("Like fehlgeschlagen:", e?.response?.data || e.message);
    } finally {
      setWorking(false);
    }
  };

  const avatarSrc = resolveUrl(author?.profilePicture) || avatarFallback;
  const postImg = resolveUrl(post?.img);

  return (
    <div className="w-[97%] mb-6 rounded-lg bg-white shadow-md">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-h-[40px]">
            <Link
              to={`/profile/${
                typeof post.userId === "string"
                  ? post.userId
                  : post.userId?._id || ""
              }`}
              className="shrink-0"
              title={
                author?.username ? `Visit ${author.username}` : "Visit profile"
              }
            >
              <img
                src={avatarSrc}
                alt={author?.username || "avatar"}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />
            </Link>

            <div className="flex flex-col">
              <Link
                to={`/profile/${
                  typeof post.userId === "string"
                    ? post.userId
                    : post.userId?._id || ""
                }`}
                className="font-semibold leading-5 hover:underline"
              >
                {author?.username || "Unbekannt"}
              </Link>
              <span className="text-xs text-gray-500">
                {post?.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-slate-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Post-Optionen"
            >
              <MdOutlineMoreVert className="text-xl" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: Modal zum Bearbeiten öffnen
                  }}
                >
                  Post bearbeiten
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm text-red-600"
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: Delete-Flow triggern
                  }}
                >
                  Post löschen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      {post?.desc && (
        <div className="px-4 pb-2">
          <p className="whitespace-pre-wrap break-words">{post.desc}</p>
        </div>
      )}

      {/* Bild (optional) */}
      {postImg ? (
        <div className="mt-2">
          <img
            src={postImg}
            alt="post"
            className="w-full max-h-[520px] object-contain"
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </div>
      ) : (
        <div className="h-2" /> // kleiner Spacer, damit Layout stabil bleibt
      )}

      {/* Footer: Likes / Comments */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={working}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded border transition ${
              isLikedByMe
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white"
            }`}
            title={isLikedByMe ? "Unlike" : "Like"}
          >
            <BiSolidLike />
            <span className="text-sm">{likes.length}</span>
          </button>
          <span className="text-sm text-gray-600">
            {likes.length === 1 ? "1 like/s" : `${likes.length} like/s`}
          </span>
        </div>

        <Link
          to={`/post/${post._id}`}
          className="text-sm text-blue-700 hover:underline"
        >
          {Array.isArray(post.comments) ? post.comments.length : 0} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
