import React, { useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { BiSolidLike } from "react-icons/bi";

import { Users } from "../../data/dummyData";

const Post = ({ post }) => {
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const user = Users.find((u) => u.id === post.userId);
  return (
    <>
      <div className="w-[97%] mb-20 shadow-lg rounded-md bg-slate-50">
        <div className="p-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={user?.profilePicture}
                alt="profilePic"
                className="w-[25px] h-[25px] rounded-full m-2"
              />
              <span className="font-bold mr-2.5">{user?.username}</span>

              <span className="text-xs">{post.date}</span>
            </div>
            <div>
              <MdOutlineMoreVert className="text-xl cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-[20px] mb-[20px]">
          <span className="p-5">{post?.desc}</span>
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
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[5px] ml-[5%] mb-[2%] ">
            <FcLike className="cursor-pointer" onClick={handleLike} />
            <BiSolidLike className="cursor-pointer" onClick={handleLike} />
            <span className="text-sm">{like} like/s</span>
          </div>
          <div className="flex items-center gap-[5px] mr-[5%] mb-[2%]">
            <span className="text-sm cursor-pointer border-b-black border-b-[1px]">
              {post.comment} comments
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
