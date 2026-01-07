// utils/api/axiosInstance.js
import axios from "axios";

// Standardexport anstelle von benannten Exporten
const axiosInstance = axios.create({
  baseURL: "https://socialmediawebsite-92x4.onrender.com/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Benannte Exporte auch noch hinzufügen, wenn nötig
export default axiosInstance; // Standardexport für axiosInstance
export const getTimeLinePost = (username) =>
  axiosInstance.get(`/posts/get-timeline-posts/${username}`);
export const getAllPosts = () => axiosInstance.get("/posts/");
export const getUserData = (userId) => axiosInstance.get(`/users/${userId}`);
export const getUserProfilData = (username) =>
  axiosInstance.get(`/users?username=${username}`);
