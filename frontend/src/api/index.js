import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:5000",
});

export const uploadVideo = (formData) =>
	api.post("/v1/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

// api.interceptors.request.use((req) => {
// 	const user = JSON.parse(localStorage.getItem("profile"));
// 	const token = user?.token;
// 	console.log("Token for request headers " + token);
// 	if (token) {
// 		req.headers.Authorization = `Bearer ${token}`;
// 	}

// 	return req;
// });
