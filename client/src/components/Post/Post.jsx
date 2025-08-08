import React, { useEffect, useState, useContext, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { MdOutlineMoreVert } from "react-icons/md";
import { FcLike } from "react-icons/fc";
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

  const isLikedByMe = me?._id ? likes.includes(me._id) : false;

  const handleLike = async () => {
    if (!me?._id || working) return;
    setWorking(true);
    try {
      await axiosInstance.put(`/posts/like/${post._id}`, { userId: me._id });
      setLikes((prev) =>
        prev.includes(me._id)
          ? prev.filter((id) => id !== me._id)
          : [...prev, me._id]
      );
    } catch (e) {
      console.error("Like failed:", e?.response?.data || e.message);
    } finally {
      setWorking(false);
    }
  };

  const avatar = resolveUrl(user?.profilePicture) || avatarFallback;
  const postImg = resolveUrl(post?.img); // ✅ Cloudinary/absolute or legacy local

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
          <MdOutlineMoreVert className="text-xl cursor-pointer" />
        </div>
      </div>

      <div className="mt-[20px] mb-[20px]">
        {post?.desc && <span className="p-5 block">{post.desc}</span>}

        {postImg && (
          <div>
            <img
              src={postImg}
              alt="post"
              className="mt-[10px] mb-[10px] w-full p-5 object-contain"
              style={{ maxHeight: "500px" }}
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] ml-[5%] mb-[2%] ">
          <FcLike className="cursor-pointer" onClick={handleLike} />
          <BiSolidLike
            className={`cursor-pointer ${isLikedByMe ? "text-blue-600" : ""}`}
            onClick={handleLike}
          />
          <span className="text-sm">{likes.length} like/s</span>
        </div>
        <div className="flex items-center gap-[5px] mr-[5%] mb-[2%]">
          <span className="text-sm cursor-pointer border-b-black border-b-[1px]">
            {Array.isArray(post.comments)
              ? post.comments.length
              : post.comment || 0}{" "}
            comments
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;
