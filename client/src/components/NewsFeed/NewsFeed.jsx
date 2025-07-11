import React from "react";
import Feed from "../Feed/Feed";
import CreatePost from "../CreatePost/CreatePost";

const NewsFeed = () => {
  return (
    <div
      style={{
        flex: 6,
        height: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
      className="bg-slate-200"
    >
      <h1>NEWSFEED</h1>
      <br />
      <CreatePost />
      <br />
      <Feed />
    </div>
  );
};

export default NewsFeed;
