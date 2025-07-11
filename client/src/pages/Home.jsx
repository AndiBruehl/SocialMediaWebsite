import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import NewsFeed from "../components/NewsFeed/NewsFeed";
import RightPanel from "../components/RightPanel/RightPanel";

const home = () => {
  return (
    <div
      style={{
        cursor: "default",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Sidebar />
      <NewsFeed />
      <RightPanel />
    </div>
  );
};

export default home;
