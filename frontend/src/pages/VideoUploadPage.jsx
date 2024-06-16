import { useState } from "react";

const VideoUploadPage = () => {
	const [title, setTitle] = useState("");
	const [video, setVideo] = useState(null);
	const [videoName, setVideoName] = useState(""); // State to hold the video file name

	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const handleVideoChange = (event) => {
		const selectedFile = event.target.files[0];
		setVideo(selectedFile);
		setVideoName(selectedFile ? selectedFile.name : ""); // Update the video file name
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!title || !video) {
			alert("Please provide both a title and a video file.");
			return;
		}

		// Handle the form submission
		const formData = new FormData();
		formData.append("title", title);
		formData.append("video", video);

		// Example: Send data to the server
		// fetch('/upload', {
		//   method: 'POST',
		//   body: formData,
		// }).then((response) => {
		//   // Handle the response from the server
		// });

		console.log("Form submitted:", title, video);
	};

	return (
		<div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-4">
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
					className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
				/>
				{videoName && ( // Display the video file name if available
					<p className="mb-4 text-gray-700">{videoName}</p>
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
