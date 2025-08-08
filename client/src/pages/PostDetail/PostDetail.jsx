// client/src/pages/PostDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useContext } from "react";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "../../utils/api/axiosInstance";
import defaultAvatar from "../../assets/avatar.webp";
import { AuthContext } from "../../context/AuthContext";
import { BiSolidLike } from "react-icons/bi";

const API_BASE = "http://localhost:9000";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const resolveUrl = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

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
  const [likes, setLikes] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [workingLike, setWorkingLike] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadPost = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axiosInstance.get(`/post/get/${postId}`);
      const p = res.data?.post || null;
      setPost(p);
      setLikes(Array.isArray(p?.likes) ? p.likes : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } finally {
      setWorkingLike(false);
    }
  };

  const handleAddComment = async (e) => {
    e?.preventDefault?.();
    const text = commentText.trim();
    if (!text || !me?._id || !post?._id || postingComment) return;
    setPostingComment(true);
    try {
      const res = await axiosInstance.post(`/post/comment/${post._id}`, {
        userId: me._id,
        desc: text,
      });
      const comments = Array.isArray(res.data?.comments)
        ? res.data.comments
        : [];
      setPost((prev) => (prev ? { ...prev, comments } : prev));
      setCommentText("");
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Lade Post…</div>;
  if (err) return <div className="p-4 text-center text-red-600">{err}</div>;
  if (!post) return <div className="p-4 text-center">Post nicht gefunden.</div>;

  const author = post.userId || {}; // durch populate Objekt
  const avatar = resolveUrl(author.profilePicture) || defaultAvatar;
  const postImg = resolveUrl(post.img);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${author._id || post.userId}`}>
          <img
            src={avatar}
            alt={author.username || "User"}
            className="w-12 h-12 rounded-full object-cover"
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
          />
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${author._id || post.userId}`}
            className="font-semibold hover:underline"
          >
            {author.username || "Unbekannt"}
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

      {/* Text & Image */}
      {post?.desc && <p className="mb-3">{post.desc}</p>}
      {postImg && (
        <img
          src={postImg}
          alt="Post"
          className="w-full rounded-lg mb-3 object-contain"
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
        />
      )}

      {/* Likes */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleToggleLike}
          disabled={workingLike}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded border ${
            isLikedByMe ? "bg-blue-600 text-white" : "bg-white"
          }`}
          title={isLikedByMe ? "Like entfernen" : "Like setzen"}
        >
          <BiSolidLike />
          <span>{likes.length}</span>
        </button>
        <span className="text-sm text-gray-600">
          {likes.length === 1 ? "1 like" : `${likes.length} likes`}
        </span>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Kommentare</h3>

        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Schreibe einen Kommentar…"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={postingComment || !commentText.trim()}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {postingComment ? "Senden…" : "Senden"}
          </button>
        </form>

        {Array.isArray(post.comments) && post.comments.length > 0 ? (
          <ul className="space-y-3">
            {post.comments.map((c) => {
              const commenter = c.userId || {};
              const commenterAvatar =
                resolveUrl(commenter.profilePicture) || defaultAvatar;
              return (
                <li key={c._id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${commenter._id || c.userId}`}>
                        <img
                          src={commenterAvatar}
                          alt={commenter.username || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                          onContextMenu={(e) => e.preventDefault()}
                          draggable="false"
                        />
                      </Link>
                      <Link
                        to={`/profile/${commenter._id || c.userId}`}
                        className="text-sm font-semibold hover:underline"
                      >
                        {commenter.username || "Unbekannt"}
                      </Link>
                    </div>
                    <span className="text-xs text-gray-500">
                      {c.createdAt
                        ? formatDistanceToNow(new Date(c.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{c.desc}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">
            Keine Kommentare vorhanden.
          </div>
        )}
      </div>
    </div>
  );
}
