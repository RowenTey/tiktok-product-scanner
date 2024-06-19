import { useEffect, useState } from "react";

const mockProfileData = {
	profilePicture: "https://via.placeholder.com/150",
	name: "John Doe",
	videos: [
		{
			_id: "1",
			url: "https://www.w3schools.com/html/mov_bbb.mp4",
			title: "Sample Video 1",
		},
		{
			_id: "2",
			url: "https://www.w3schools.com/html/mov_bbb.mp4",
			title: "Sample Video 2",
		},
	],
};

const fetchMockProfile = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ data: mockProfileData });
		}, 1000);
	});
};

const ProfilePage = () => {
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				// const response = await axios.get("/profile");
				const response = await fetchMockProfile();
				setProfile(response.data);
			} catch (error) {
				console.error("Failed to fetch profile data:", error);
			}
		};

		fetchProfile();
	}, []);

	if (!profile) {
		return (
			<div className="h-full w-full bg-white flex items-center justify-center">
				<div className="animate-spin h-5 w-5 mr-3 rounded border-y-4 bg-red-100"></div>
			</div>
		);
	}

	return (
		<div className="h-full w-full flex flex-col bg-gray-100">
			<div className="flex flex-col items-center justify-center p-4 bg-white shadow-md">
				<img
					src={profile.profilePicture}
					alt="Profile"
					className="rounded-full h-32 w-32 mb-4"
				/>
				<h1 className="text-2xl font-bold mb-4 text-blue-600">
					{profile.name}
				</h1>
			</div>
			<div className="flex flex-col items-center p-4 overflow-y-auto flex-grow">
				<h2 className="text-xl mb-4">Uploaded Videos</h2>
				<div className="flex flex-wrap justify-center">
					{profile.videos.map((video) => (
						<div key={video._id} className="m-4">
							<video
								src={video.url}
								controls
								className="w-full h-auto max-w-xs"
							/>
							<h3 className="text-center mt-2 text-gray-800">{video.title}</h3>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
