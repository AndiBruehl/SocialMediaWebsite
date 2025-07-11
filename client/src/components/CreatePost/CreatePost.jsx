import React from "react";
import profilePic from "../../assets/pic1.png";
import {
  MdLabel,
  MdPermMedia,
  MdEmojiEmotions,
  MdLocationPin,
} from "react-icons/md";

const CreatePost = () => {
  return (
    <div className="w-[95%] h-[225px] shadow-lg rounded-lg bg-slate-50">
      <div className="wrapper p-[10px]">
        <div className="top flex items-center justify-between">
          <img
            src={profilePic}
            alt="profilePic"
            className="w-[50px] h-[50px] rounded-full m-2"
          />
          <input
            type="text"
            placeholder="What`s on your Mind?"
            className="w-[100%] m-1 focus:outline-none"
          />
        </div>
        <hr />
        <div className="bottom flex justify-start items-center space-x-4 mt-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdPermMedia />
            <span className="cursor-pointer text-blue-500 rounded hover:text-blue-600 active:text-blue-700">
              Media
            </span>
          </div>{" "}
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdLabel />
            <span className="cursor-pointer text-blue-500 rounded hover:text-blue-600 active:text-blue-700">
              Tags
            </span>
          </div>{" "}
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdEmojiEmotions />
            <span className="cursor-pointer text-blue-500 rounded hover:text-blue-600 active:text-blue-700">
              Emoji
            </span>
          </div>{" "}
          <div className="flex items-center space-x-2 cursor-pointer">
            <MdLocationPin />
            <span className="cursor-pointer text-blue-500 rounded hover:text-blue-600 active:text-blue-700">
              Area
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="cursor-pointer bg-blue-500 font-bold text-white px-4 py-2 rounded hover:bg-blue-600">
            POST!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
