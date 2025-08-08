import React, { useEffect, useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post.jsx";
import axiosInstance from "../../utils/api/axiosInstance";
import { useParams } from "react-router-dom";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const { userId } = useParams(); // Wenn gesetzt → Profilseite

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = userId
          ? `/post/user/${userId}` // nur die Posts des Users
          : `/post/all`; // alle Posts für Startseite

        const res = await axiosInstance.get(endpoint);
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
      {/* Post erstellen nur, wenn kein Profil aufgerufen */}
      {!userId && <CreatePost />}
      <br />
      <hr />
      {posts.length > 0 ? (
        posts
          .filter((post) => post && post._id && post.userId)
          .map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p className="mt-6 text-gray-500">Keine Posts gefunden.</p>
      )}
      <br />
      <hr />
    </div>
  );
};

export default NewsFeed;
