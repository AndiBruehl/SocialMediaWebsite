import React from "react";
import { RightPanelProfile } from "../../components/RightPanel/RightPanel";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import coverImage from "./assets/cover.jpg";
import userImage from "./assets/userImage.jpg";

const Profile = () => {
  return (
    <div className="flex flex-col rounded-[25%]">
      <div
        style={{
          flex: 9,
          backgroundColor: "white",
        }}
      >
        <div>
          <div className="h-[350] relative">
            <img
              src={coverImage}
              alt="coverImage"
              className="w-full h-[200px] object-cover "
            />
            <img
              src={userImage}
              alt="userImage"
              className="h-[100px] w-[100px] object-cover rounded-full absolute left-0 right-0 m-auto top-[150px] border-4 border-slate-150"
            />
          </div>
          <div className="flex flex-col items-center mt-[75px] ml-[2%] mr-[2%]">
            <h1 className="font-bold text-2xl">Kwaku Sam</h1>
            <span>I'm new here and love to explore new opportunities. </span>
          </div>
        </div>
      </div>
      <div className="flex mt-[3%]">
        <NewsFeed />
        <RightPanelProfile />
      </div>

      <div></div>
    </div>
  );
};

console.log("Profile loaded");
export default Profile;
