// client/src/components/Post/Post.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MdOutlineMoreVert } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import avatarFallback from "../../assets/avatar.webp";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const resolveUrl = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

const Post = ({ post, onDeleted, onUpdated }) => {
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

  // Edit/Delete UI
  const [editOpen, setEditOpen] = useState(false);
  const [editDesc, setEditDesc] = useState(post?.desc || "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setEditDesc(post?.desc || ""), [post?.desc]);

  // Autor laden
  useEffect(() => {
    const loadAuthor = async () => {
      try {
        if (!post?.userId) return;

        // Wenn schon populated:
        if (typeof post.userId === "object" && post.userId.username) {
          setAuthor(post.userId);
          return;
        }

        const uid =
          typeof post.userId === "string" ? post.userId : post.userId._id;

        // Nur wenn es wie eine Mongo ObjectId aussieht
        const isValidOid =
          typeof uid === "string" && /^[0-9a-fA-F]{24}$/.test(uid);
        if (!isValidOid) {
          setAuthor(null);
          return;
        }

        const res = await axiosInstance.get(`/users/${uid}`);
        setAuthor(res.data?.userInfo || null);
      } catch (e) {
        setAuthor(null);
        console.log(e);
      }
    };
    loadAuthor();
  }, [post?.userId]);

  const isMine =
    me?._id &&
    post?.userId &&
    String(me._id) ===
      String(typeof post.userId === "string" ? post.userId : post.userId._id);

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
      console.error("Liking failed:", e?.response?.data || e.message);
    } finally {
      setWorking(false);
    }
  };

  const handleOpenEdit = () => {
    setMenuOpen(false);
    setEditDesc(post?.desc || "");
    setEditOpen(true);
  };

  const handleSubmitEdit = async (e) => {
    e?.preventDefault?.();
    if (!isMine || !post?._id) return;
    try {
      const body = { userId: me._id, desc: editDesc };
      const res = await axiosInstance.put(`/post/update/${post._id}`, body);
      const updated = res.data?.updatedPost || post;
      setEditOpen(false);
      if (onUpdated) onUpdated(updated);
    } catch (e) {
      console.error("Update failed:", e?.response?.data || e.message);
    }
  };

  const handleDelete = async () => {
    if (!isMine || !post?._id || deleting) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/post/delete/${post._id}`);
      setMenuOpen(false);
      if (onDeleted) onDeleted(post._id);
    } catch (e) {
      console.error("Deleting failed:", e?.response?.data || e.message);
    } finally {
      setDeleting(false);
    }
  };

  const avatarSrc = resolveUrl(author?.profilePicture) || avatarFallback;
  const postImg = resolveUrl(post?.img);

  return (
    <div className="w-[97%] mb-6 rounded-lg bg-white dark:bg-gray-800 shadow-md relative border border-transparent dark:border-gray-700 transition-colors duration-300">
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
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-gray-600"
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
                className="font-semibold leading-5 hover:underline text-gray-900 dark:text-white"
              >
                {author?.username || "Unknown"}
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {post?.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {post?.location && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                📍 {post.location}
              </span>
            )}

            {isMine && (
              <div className="relative">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Post options"
                >
                  <MdOutlineMoreVert className="text-xl text-gray-700 dark:text-gray-200" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 transition-colors">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                      onClick={handleOpenEdit}
                    >
                      Update post
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400 disabled:opacity-50"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete post"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text */}
      {post?.desc && (
        <div className="px-4 pb-2">
          <p className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
            {post.desc}
          </p>
        </div>
      )}

      {/* Bild (optional) */}
      {postImg ? (
        <div className="mt-2">
          <img
            src={postImg}
            alt="post"
            className="w-full max-h-[520px] object-contain bg-black"
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </div>
      ) : (
        <div className="h-2" />
      )}

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={working}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded border transition ${
              isLikedByMe
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            }`}
            title={isLikedByMe ? "Unlike" : "Like"}
          >
            <BiSolidLike />
            <span className="text-sm">{likes.length}</span>
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {likes.length === 1 ? "1 like/s" : `${likes.length} like/s`}
          </span>
        </div>

        <Link
          to={`/post/${post._id}`}
          className="text-sm text-blue-700 dark:text-blue-400 hover:underline"
        >
          {Array.isArray(post.comments) ? post.comments.length : 0} comments
        </Link>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-4 border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Update post
            </h3>
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full border rounded p-2 min-h-[120px] bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Was möchtest du ändern?"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
