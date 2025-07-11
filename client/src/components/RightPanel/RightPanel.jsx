import React from "react";

import { BiSolidGift } from "react-icons/bi";
import adImage from "../../assets/ad.png";
import profilePic from "../../assets/pic1.png";

const RightPanel = () => {
  return (
    <div
      style={{
        flex: 2,
        height: "100vh - 80px",
      }}
      className="bg-slate-400 p-5 rounded-[15px] text-white"
    >
      <div className="pt-[20px] pr-[20px]">
        <div className="flex items-center justify-center">
          <BiSolidGift className="w-[50px] h-[50px] mr-[10px]" />
          <span className="text-xs">
            <b>Liana Weiss</b> and
            <b> 2 others</b> have a birthday today.
          </span>
        </div>
        <img src={adImage} alt="Ad" className="w-full rounded-lg mt-8 mb-8" />
        <h1 className="font-bold text-lg mb-5">ONLINE</h1>
        <ul className="m-0 p-0 ">
          <li className="flex items-center mb-2.5">
            <div className="mr-2.5 relative">
              <img
                src={profilePic}
                alt="profilePic"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              <span className="w-[12px] h-[12px] rounded-full bg-green-600 absolute top-[-2px] right-0 border-[2px]"></span>
            </div>
            <span className="text-sm ml-3">Violett Smith</span>
          </li>{" "}
          <li className="flex items-center mb-2.5">
            <div className="mr-2.5 relative">
              <img
                src={profilePic}
                alt="profilePic"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              <span className="w-[12px] h-[12px] rounded-full bg-green-600 absolute top-[-2px] right-0 border-[2px]"></span>
            </div>
            <span className="text-sm ml-3">Violett Smith</span>
          </li>{" "}
          <li className="flex items-center mb-2.5">
            <div className="mr-2.5 relative">
              <img
                src={profilePic}
                alt="profilePic"
                className="w-[40px] h-[40px] rounded-full object-cover"
              />
              <span className="w-[12px] h-[12px] rounded-full bg-green-600 absolute top-[-2px] right-0 border-[2px]"></span>
            </div>
            <span className="text-sm ml-3">Violett Smith</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;
