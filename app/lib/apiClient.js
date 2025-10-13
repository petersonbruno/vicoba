import axios from "axios";

// apiClient.js
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/", // matches ALLOWED_HOSTS
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
