import React from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post.jsx";
import { Posts } from "../../data/dummyData.js";

const NewsFeed = () => {
  return (
    <div
      style={{
        flex: 8,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "calc(100vh - 80px)",
      }}
      className="bg-slate-200"
    >
      {/*      <h1 className="text-3xl italic underline">NEWSFEED</h1>
       */}
      <br />
      <CreatePost />
      <br />
      <hr />
      {Posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <br />
      <hr />
    </div>
  );
};

export default NewsFeed;
