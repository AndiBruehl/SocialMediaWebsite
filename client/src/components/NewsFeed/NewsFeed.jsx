import React, { useEffect, useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post.jsx";
import { Posts } from "../../data/dummyData.js";
import axiosInstance from "../../utils/api/axiosInstance";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const timelinePosts = async () => {
      try {
        const res = await axiosInstance.get(
          "/post/timeline/685ead8decc284f95632bd55"
        );

        setPosts(res.data.timelinePosts);
        console.log(res.data);
      } catch (error) {
        console.log("Fehler beim Laden der Posts:", error);
      }
    };

    timelinePosts();
  }, []);

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
      <br />
      <CreatePost />
      <br />
      <hr />
      {posts
        .filter((post) => post && post._id && post.userId)
        .map((post) => (
          <Post key={post._id} post={post} />
        ))}
      <br />
      <hr />
    </div>
  );
};

export default NewsFeed;
