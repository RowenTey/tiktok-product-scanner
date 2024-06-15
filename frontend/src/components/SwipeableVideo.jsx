import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import JapanVid from "../assets/japan.mp4";
import MacbookVid from "../assets/macbook.mp4";

const videos = [
	{ id: 1, src: JapanVid, title: "Japan" },
	{ id: 2, src: MacbookVid, title: "MacBook" },
	// { id: 3, src: "video3.mp4", title: "Video 3" },
];

const SwipeableVideoList = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleSwipedUp = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
	};

	const handleSwipedDown = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + videos.length) % videos.length
		);
	};

	const handlers = useSwipeable({
		onSwipedUp: handleSwipedUp,
		onSwipedDown: handleSwipedDown,
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	});

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
						<video
							className="h-full"
							src={video.src}
							controls
							autoPlay
							loop
							width={376}
						/>
						<div className="absolute bottom-10 text-white text-center">
							<h1 className="text-2xl font-bold">{video.title}</h1>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SwipeableVideoList;
