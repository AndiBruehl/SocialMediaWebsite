import React from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post";

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
      <h1 className="text-3xl italic underline">NEWSFEED</h1>
      <br />
      <CreatePost />
      <br />
      <hr />
      <Post />{" "}
    </div>
  );
};

export default NewsFeed;
