import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import { RightPanelHome } from "../../components/RightPanel/RightPanel";

const home = () => {
  return (
    <div
      style={{
        cursor: "default",
        display: "flex",
        alignItems: "start",
      }}
    >
      <Sidebar />
      <NewsFeed />
      <RightPanelHome />
    </div>
  );
};

export default home;
