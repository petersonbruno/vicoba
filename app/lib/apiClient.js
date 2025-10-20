// import axios from "axios";

// // apiClient.js
// const apiClient = axios.create({
//   // baseURL: "http://localhost:8000/api/", // matches ALLOWED_HOSTS
//   baseURL: "aloyceptrsn7.pythonanywhere.com", // matches ALLOWED_HOSTS
//   headers: { "Content-Type": "application/json" },
// });

// export default apiClient;


import axios from "axios";

// apiClient.js
const apiClient = axios.create({
  baseURL: "https://aloyceptrsn7.pythonanywhere.com/api/", // ✅ Full URL with protocol + correct path
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
