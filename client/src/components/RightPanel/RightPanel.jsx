import React from "react";

import { BiSolidGift } from "react-icons/bi";
import adImage from "../../assets/ad.png";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import { Users } from "../../data/dummyData";

const RightPanel = () => {
  return (
    <div
      style={{
        flex: 2,
        height: "100vh - 80px",
        marginLeft: "2%",
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
        {Users.map((user) => (
          <OnlineUsers key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
