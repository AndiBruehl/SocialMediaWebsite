import React, { useEffect, useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post.jsx";
import axiosInstance from "../../utils/api/axiosInstance";
import { useParams } from "react-router-dom";

const userIdTemp = "685ead8decc284f95632bd55"; // fallback für Feed

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const { userId } = useParams(); // von Route → wenn vorhanden, dann Profilseite

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const isProfilePage = Boolean(userId);
        const endpoint = isProfilePage
          ? `/post/user/${userId}`
          : `/post/timeline/${userIdTemp}`;

        const res = await axiosInstance.get(endpoint);

        // Je nach Route: Zugriff auf `posts` oder `timelinePosts`
        const postData = res.data.posts || res.data.timelinePosts || [];

        const sortedPosts = postData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Fehler beim Laden der Posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

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
