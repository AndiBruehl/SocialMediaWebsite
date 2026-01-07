import axios from "axios"; // Assuming you have axios installed
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important if you are using Cookies for JWT
});

// Auth
export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);

// Posts
export const createPost = (data) => api.post("/posts", data);
export const getFeed = () => api.get("/posts");

// Users
export const getUserProfile = (id) => api.get(`/users/${id}`);

export default api;
