// client/src/components/NewsFeed/NewsFeed.jsx
import React, { useEffect, useState } from "react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post.jsx";
import axiosInstance from "../../utils/api/axiosInstance";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = userId ? `/post/user/${userId}` : `/post/all`;

        const res = await axiosInstance.get(endpoint);
        const postData = res.data.posts || res.data.timelinePosts || [];

        const sortedPosts = postData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  // Post löschen
  const handleDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    toast.success("Post deleted successfully... ✅", {
      onClose: () => window.location.reload(),
    });
  };

  // Post nach Bearbeitung updaten
  const handleUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    toast.success("Post updated successfully ✏️", {
      onClose: () => window.location.reload(),
    });
  };

  return (
    <div className="flex-[8] flex flex-col items-center min-h-[calc(100vh-80px)] bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-[97%] py-4">{!userId && <CreatePost />}</div>

      <div className="w-[97%] border-b border-gray-200 dark:border-gray-700 mb-4" />

      <div className="w-[97%] flex flex-col gap-4">
        {posts.length > 0 ? (
          posts
            .filter((post) => post && post._id && post.userId)
            .map((post) => (
              <Post
                key={post._id}
                post={post}
                onDeleted={handleDeleted}
                onUpdated={handleUpdated}
              />
            ))
        ) : (
          <p className="mt-6 text-gray-500 dark:text-gray-400 text-center">
            No Posts found...
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
