import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import NewsFeed from "../../components/NewsFeed/NewsFeed";
import { RightPanelHome } from "../../components/RightPanel/RightPanel";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row items-start cursor-default min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-row w-full">
        <NewsFeed />
        <RightPanelHome />
      </div>
    </div>
  );
};

export default Home;
