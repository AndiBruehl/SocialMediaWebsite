import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "../../utils/api/axiosInstance";
import defaultAvatar from "../../assets/avatar.webp";
import { AuthContext } from "../../context/AuthContext";
import { BiSolidLike } from "react-icons/bi";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const resolveUrl = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_POST_PRESET);
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
};

export default function PostDetail() {
  const { postId } = useParams();
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

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [likes, setLikes] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState(null);
  const [workingLike, setWorkingLike] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axiosInstance.get(`/post/get/${postId}`);
        const p = res.data?.post || null;
        setPost(p);
        setLikes(Array.isArray(p?.likes) ? p.likes : []);

        // Autor holen (falls post.userId = String)
        if (p?.userId) {
          if (typeof p.userId === "object" && p.userId.username) {
            setAuthor(p.userId);
          } else {
            const ures = await axiosInstance.get(`/users/${p.userId}`);
            setAuthor(ures.data?.userInfo || null);
          }
        }
      } catch (e) {
        setErr(e?.response?.data?.message || "Error while loading:");
      } finally {
        setLoading(false);
      }
    };
    if (postId) load();
  }, [postId]);

  const isLikedByMe = me?._id
    ? likes.map(String).includes(String(me._id))
    : false;

  const handleToggleLike = async () => {
    if (!me?._id || !post?._id || workingLike) return;
    setWorkingLike(true);
    try {
      const res = await axiosInstance.put(`/post/like/${post._id}`, {
        userId: me._id,
      });
      if (Array.isArray(res.data.likes)) setLikes(res.data.likes);
    } catch (e) {
      console.error("Liking failed:", e?.response?.data || e.message);
    } finally {
      setWorkingLike(false);
    }
  };

  const handleAddComment = async (e) => {
    e?.preventDefault?.();
    const text = commentText.trim();

    // Return if both empty
    if (!text && !commentFile) return;

    if (!me?._id || !post?._id || postingComment) return;

    setPostingComment(true);
    try {
      let imgUrl = "";
      if (commentFile) {
        imgUrl = await uploadToCloudinary(commentFile);
      }

      const res = await axiosInstance.post(`/post/comment/${post._id}`, {
        userId: me._id,
        desc: text,
        img: imgUrl,
      });

      const comments = Array.isArray(res.data?.comments)
        ? res.data.comments
        : [];

      setPost((prev) => (prev ? { ...prev, comments } : prev));
      setCommentText("");
      setCommentFile(null);
    } catch (e) {
      console.error("Commenting failed:", e?.response?.data || e.message);
    } finally {
      setPostingComment(false);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Lade Post…
      </div>
    );
  if (err)
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        {err}
      </div>
    );
  if (!post)
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        Post nicht gefunden.
      </div>
    );

  const avatar = resolveUrl(author?.profilePicture) || defaultAvatar;
  const postImg = resolveUrl(post?.img);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          to={`/profile/${
            typeof post.userId === "string"
              ? post.userId
              : post.userId?._id || ""
          }`}
          className="shrink-0"
        >
          <img
            src={avatar}
            alt={author?.username || "User"}
            className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
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
            className="font-semibold hover:underline"
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
          {post?.location && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              📍 {post.location}
            </span>
          )}
        </div>
      </div>

      {/* Text & Image */}
      <div className="mb-6">
        {post?.desc && (
          <p className="mb-3 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {post.desc}
          </p>
        )}
        {postImg && (
          <img
            src={postImg}
            alt="Post"
            className="w-full rounded-lg object-contain bg-black dark:bg-black max-h-[600px]"
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        )}
      </div>

      {/* Likes */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleToggleLike}
          disabled={workingLike}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded border transition ${
            isLikedByMe
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          }`}
          title={isLikedByMe ? "remove like" : "set like"}
        >
          <BiSolidLike />
          <span>{likes.length}</span>
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {likes.length === 1 ? "1 like" : `${likes.length} likes`}
        </span>
      </div>

      {/* Comments */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold mb-4">Comments</h3>

        {/* Add comment */}
        <form onSubmit={handleAddComment} className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <label className="flex items-center px-3 py-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              <span>Img</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCommentFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {commentFile && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>📎 {commentFile.name}</span>
              <button
                type="button"
                onClick={() => setCommentFile(null)}
                className="text-red-500 hover:text-red-400"
              >
                Clear
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={postingComment || (!commentText.trim() && !commentFile)}
            className="ml-auto px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors"
          >
            {postingComment ? "Sending..." : "Send"}
          </button>
        </form>

        {/* List comments */}
        {Array.isArray(post.comments) && post.comments.length > 0 ? (
          <ul className="space-y-4">
            {post.comments.map((c) => {
              // c.userId ist dank populate ein Objekt mit username/profilePicture
              const cu = c.userId || {};
              const cAvatar = resolveUrl(cu.profilePicture) || defaultAvatar;
              const cUserId =
                typeof c.userId === "object" ? c.userId._id : c.userId;

              return (
                <li
                  key={c._id}
                  className="border border-gray-200 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      to={`/profile/${cUserId}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={cAvatar}
                        alt={cu.username || "user"}
                        className="w-8 h-8 rounded-full object-cover"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable="false"
                      />
                      <span className="text-sm font-semibold">
                        {cu.username || "User"}
                      </span>
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {c.createdAt
                        ? formatDistanceToNow(new Date(c.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>
                  {c.desc && (
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 whitespace-pre-wrap">
                      {c.desc}
                    </p>
                  )}
                  {c.img && (
                    <img
                      src={resolveUrl(c.img)}
                      alt="comment"
                      className="max-h-64 rounded object-contain"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable="false"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No comments yet.
          </div>
        )}
      </div>
    </div>
  );
}
