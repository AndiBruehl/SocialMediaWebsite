import React from "react";
import profilePic from "../../assets/pic1.png";
import testPic from "../../assets/pic2.jpg";
import { MdOutlineMoreVert } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { BiSolidLike } from "react-icons/bi";

const Post = () => {
  return (
    <>
      <div className="w-[97%] mb-20 shadow-lg rounded-md bg-slate-50">
        <div className="p-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={profilePic}
                alt="profilePic"
                className="w-[25px] h-[25px] rounded-full m-2"
              />
              <span className="font-bold mr-2.5">Violett Smith</span>

              <span className="text-xs">20 mins ago</span>
            </div>{" "}
            <div>
              <MdOutlineMoreVert className="text-xl cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-[20px] mb-[20px]">
          <span className="p-5">test</span>
          <div>
            <img
              src={testPic}
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
            <FcLike className="cursor-pointer" />
            <BiSolidLike className="cursor-pointer" />
            <span className="text-sm">567 likes</span>
          </div>
          <div className="flex items-center gap-[5px] mr-[5%] mb-[2%]">
            <span className="text-sm cursor-pointer border-b-black border-b-[1px]">
              52 comments
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
