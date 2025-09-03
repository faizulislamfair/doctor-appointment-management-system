// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://appointment-manager-node.onrender.com/api/v1",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
