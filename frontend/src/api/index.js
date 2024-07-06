import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const uploadVideo = (formData) =>
  api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getVideos = (page = 1, limit = 2) =>
  api.get(`/videos?page=${page}&limit=${limit}`);

// api.interceptors.request.use((req) => {
// 	const user = JSON.parse(localStorage.getItem("profile"));
// 	const token = user?.token;
// 	console.log("Token for request headers " + token);
// 	if (token) {
// 		req.headers.Authorization = `Bearer ${token}`;
// 	}

// 	return req;
// });
