import React from "react";
import Feed from "../Feed/Feed";

const NewsFeed = () => {
  return (
    <div
      style={{
        flex: 6,
        height: "calc(100vh - 80px)",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-slate-200"
    >
      NewsFeed
      <br />
      <Feed />
    </div>
  );
};

export default NewsFeed;
