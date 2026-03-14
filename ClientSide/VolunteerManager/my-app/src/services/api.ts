import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7222", // כתובת השרת שלך
});

// שליחת JWT אוטומטית
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("adminUser");
  if (user) {
    const token = JSON.parse(user).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;