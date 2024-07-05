import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ReactPlayer from "react-player";
import JapanVid from "../assets/japan.mp4";
import MacbookVid from "../assets/macbook.mp4";
import { getVideos } from "../api";

const dummyVideos = [
	{
		id: 1,
		src: JapanVid,
		title: "Japan",
	},
	{ id: 2, src: MacbookVid, title: "MacBook" },
];

const SwipeableVideoList = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [playing, setPlaying] = useState(true);
	const [played, setPlayed] = useState(0);
	const [videos, setVideos] = useState(dummyVideos);

	const handleSwipedUp = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
		setPlaying(true);
		setPlayed(0);
	};

	const handleSwipedDown = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + videos.length) % videos.length,
		);
		setPlaying(true);
		setPlayed(0);
	};

	const togglePlay = () => {
		setPlaying((prevPlaying) => !prevPlaying);
	};

	const handleProgress = (state) => {
		setPlayed(state.played);
	};

	const handlers = useSwipeable({
		onSwipedUp: handleSwipedUp,
		onSwipedDown: handleSwipedDown,
		onTap: togglePlay,
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	});

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const response = await getVideos();
				const videosResults = [];
				response.data.videos.forEach(async (video) => {
					videosResults.push({
						id: video._id,
						src: video.presignedUrl,
						title: video.title,
					});
				});
				setVideos(videosResults);
				console.log("SUCCESSFUL GET videos");
			} catch (error) {
				console.error("Error fetching videos:", error);
			}
		};
		fetchVideos();
	}, []);

	return (
		<div {...handlers} className="h-full w-full">
			<div className="relative h-full w-full flex flex-col items-center justify-center bg-black">
				{videos.map((video, index) => (
					<div
						key={video.id}
						className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
							index === currentIndex ? "opacity-100" : "opacity-0"
						}`}
					>
						{index === currentIndex && (
							<ReactPlayer
								url={video.src}
								playing={playing}
								loop
								width="100%"
								height="100%"
								className="react-player"
								onProgress={handleProgress}
							/>
						)}
						<div className="absolute bottom-10 text-white">
							<h1 className="text-2xl font-bold">
								{video.title}
							</h1>
						</div>
						<div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
							<div
								className="h-full bg-white"
								style={{
									width: `${played * 100}%`,
									transition: "width 0.2s linear",
								}}
							></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SwipeableVideoList;
