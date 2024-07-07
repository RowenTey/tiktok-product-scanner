import { useState } from "react";
import { uploadVideo } from "../api";
import { ArrowUpOnSquareStackIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../store/auth-context";
import { useNavigate } from "react-router-dom";

const VideoUploadPage = () => {
	const [title, setTitle] = useState("");
	const [video, setVideo] = useState(null);
	const [videoName, setVideoName] = useState("");
	const {isLoggedIn} = useAuth();
	const navigate = useNavigate();

	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const handleVideoChange = (event) => {
		const selectedFile = event.target.files[0];
		setVideo(selectedFile);
		setVideoName(selectedFile ? selectedFile.name : "");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!title || !video) {
			alert("Please provide both a title and a video file.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("video", video);

		try {
			const response = await uploadVideo(formData);

			if (response.status === 200) {
				alert("Upload successful");

				// Clear form fields
				setTitle("");
				setVideo(null);
				setVideoName("");
			} else {
				alert("Upload failed");
			}
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Upload failed");
		}

		console.log("Form submitted:", title, video);
	};
	
	if (!isLoggedIn) {
		return (
			<div className="h-full w-full flex items-center justify-center bg-stone-700 p-4">
				<h1 className="text-2xl text-center font-bold mb-4 text-blue-600">
					Please <span className="underline cursor-pointer" onClick={() => navigate("/login")}>log in</span> to upload a video
				</h1>
			</div>
		);
	}

	return (
		<div className="h-full w-full flex flex-col items-center justify-center bg-stone-700 p-4">
			<h1 className="text-2xl font-bold mb-4 text-blue-600">Upload a Video</h1>
			<form onSubmit={handleSubmit} className="flex flex-col items-center">
				<input
					type="text"
					placeholder="Video Title"
					value={title}
					onChange={handleTitleChange}
					className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
				/>
				<input
					type="file"
					accept="video/*"
					onChange={handleVideoChange}
					id="fileInput"
					className="hidden"
				/>
				<label htmlFor="fileInput" className="cursor-pointer inline-flex justify-center items-center mb-4 p-2 border border-gray-300 rounded w-full max-w-md bg-stone-600 hover:bg-stone-800">
					<ArrowUpOnSquareStackIcon className="mr-2 w-6 h-6" />
					<span>Upload</span>
				</label>
				{videoName && ( // Display the video file name if available
					<p className="mb-4 text-white font-bold">Uploaded: {videoName}</p>
				)}
				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
				>
					Upload
				</button>
			</form>
		</div>
	);
};

export default VideoUploadPage;
