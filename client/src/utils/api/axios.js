// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://socialmediawebsite-92x4.onrender.com",
  withCredentials: true,
});

export default instance;
