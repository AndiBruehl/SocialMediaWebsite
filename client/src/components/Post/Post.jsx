import React, { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";

import { MdOutlineMoreVert } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { BiSolidLike } from "react-icons/bi";

import axiosInstance from "../../utils/api/axiosInstance";

import avatar from "../../assets/avatar.webp";

const Post = ({ post }) => {
  const [like, setLike] = useState(Number(post.like) || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      if (!post.userId) return null;

      try {
        const res = await axiosInstance.get(`/users/${post.userId}`);
        setUser(res.data.userInfo);
      } catch (error) {
        console.log("Fehler beim Laden des Users:", error);
      }
    };

    getUserInfo();
  }, [post.userId]); // 💡 Nur neu laden, wenn sich userId ändert

  const handleLike = () => {
    const safeLike = Number(like) || 0;
    setLike(isLiked ? safeLike - 1 : safeLike + 1);
    setIsLiked(!isLiked);
  };

  //  const user = Users.find((u) => u.id === post.userId);
  return (
    <>
      <div className="w-[97%] mb-20 shadow-lg rounded-md bg-slate-50">
        <div className="p-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={user?.profilePicture || avatar}
                alt="profilePic"
                className="w-[25px] h-[25px] rounded-full m-2"
              />
              {user.username && (
                <span className="font-bold mr-2.5">{user.username}</span>
              )}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>{" "}
            </div>
            <div>
              <MdOutlineMoreVert className="text-xl cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-[20px] mb-[20px]">
          <span className="p-5">{post?.desc}</span>
          {post?.photo && (
            <div>
              <img
                src={post.photo}
                alt="postPicture"
                className="mt-[10px] mb-[10px] w-full p-5 object-contain"
                style={{
                  maxHeight: "500px",
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[5px] ml-[5%] mb-[2%] ">
            <FcLike className="cursor-pointer" onClick={handleLike} />
            <BiSolidLike className="cursor-pointer" onClick={handleLike} />
            <span className="text-sm">{like ?? 0} like/s</span>
          </div>
          <div className="flex items-center gap-[5px] mr-[5%] mb-[2%]">
            <span className="text-sm cursor-pointer border-b-black border-b-[1px]">
              {post.comment ?? 0} comments
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
