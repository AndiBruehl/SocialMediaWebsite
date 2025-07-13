import React from "react";

import { BiSolidGift } from "react-icons/bi";
import adImage from "../../assets/ad.png";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import { Users } from "../../data/dummyData";

import profPic from "../../assets/pic1.png";

const RightPanel = () => {
  const RightPanelHome = () => {
    return (
      <>
        <div
          style={{
            flex: 2,
            height: "100vh - 80px",
            marginLeft: "2%",
            maxWidth: "300px",
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
            <img
              src={adImage}
              alt="Ad"
              className="w-full rounded-lg mt-8 mb-8"
            />
            <h1 className="font-bold text-lg mb-5">ONLINE</h1>
            {Users.map((user) => (
              <OnlineUsers key={user.id} user={user} />
            ))}
          </div>
        </div>
      </>
    );
  };
  const RightPanelProfile = () => {
    return (
      <>
        <div
          style={{
            flex: 2,
            height: "100vh - 80px",
            marginLeft: "2%",
            maxWidth: "300px",
            textAlign: "end",
          }}
          className="bg-slate-400 p-5 rounded-[15px] text-white"
        >
          <h1 className="font-bold text-xl mb-[20px]">User Info</h1>
          <div className="mb-[30px]">
            <div className="mb-[10px]">
              <span className="font-semibold mr-[15px]  text-blue-900">
                City:
              </span>
              <span className="">Erfurt</span>
            </div>
          </div>{" "}
          <div className="mb-[30px]">
            <div className="mb-[10px]">
              <span className="font-semibold mr-[15px]  text-blue-900">
                From:
              </span>
              <span className="">Erfurt</span>
            </div>
          </div>{" "}
          <div className="mb-[30px]">
            <div className="mb-[10px]">
              <span className="font-semibold mr-[15px]  text-blue-900">
                Relationship:
              </span>
              <span className="">Single</span>
            </div>
          </div>
          <h1 className="font-bold text-xl mt-[50px] mb-[20px]">Friends</h1>
          <div
            className="grid grid-cols-2"
            style={{
              textAlign: "start",
              paddingLeft: "10%",
              paddingBottom: "15%",
              gap: "15%",
            }}
          >
            <div>
              <img
                src={profPic}
                alt="profPic"
                className="object-cover h-[40px]  w-[40px] rounded-full "
              />
              <span>Friend One</span>
            </div>{" "}
            <div>
              <img
                src={profPic}
                alt="profPic"
                className="object-cover h-[40px]  w-[40px] rounded-full "
              />
              <span>Friend One</span>
            </div>{" "}
            <div>
              <img
                src={profPic}
                alt="profPic"
                className="object-cover h-[40px]  w-[40px] rounded-full "
              />
              <span>Friend One</span>
            </div>{" "}
            <div>
              <img
                src={profPic}
                alt="profPic"
                className="object-cover h-[40px]  w-[40px] rounded-full "
              />
              <span>Friend One</span>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <div>
      <RightPanelProfile />
    </div>
  );
};

export default RightPanel;
