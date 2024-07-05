import { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import JapanVid from "../assets/japan.mp4";
import MacbookVid from "../assets/macbook.mp4";
import { getVideos } from "../api";
import ProductsList from "./ProductsList";
import "./style.css";

const dummyVideos = [
    {
        id: 1,
        src: JapanVid,
        title: "Japan",
    },
    { id: 2, src: MacbookVid, title: "MacBook" },
];

const limit = 5;

const SwipeableVideoList = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [played, setPlayed] = useState(0);
    const [videos, setVideos] = useState(dummyVideos);
    const [showProducts, setShowProducts] = useState(false);
    const containerRef = useRef(null);

    const handleTouchStart = useCallback(
        (e) => {
            if (showProducts) {
                return;
            }
            const touch = e.touches[0];
            containerRef.current.startX = touch.clientX;
            containerRef.current.startY = touch.clientY;
        },
        [showProducts]
    );

    const handleTouchMove = useCallback(
        (e) => {
            if (!containerRef.current.startX || !containerRef.current.startY) {
                return;
            }

            if (showProducts) {
                return;
            }

            const touch = e.touches[0];
            const deltaX = containerRef.current.startX - touch.clientX;
            const deltaY = containerRef.current.startY - touch.clientY;

            // Check if the swipe is vertical (more vertical movement than horizontal)
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                return;
            }

            // Check if the swipe distance is significant
            const threshold = 50;
            if (Math.abs(deltaY) > threshold) {
                if (deltaY > 0) {
                    handleSwipedUp();
                } else {
                    handleSwipedDown();
                }

                containerRef.current.startX = null;
                containerRef.current.startY = null;
            }
        },
        [showProducts]
    );

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [handleTouchStart, handleTouchMove]);

    const handleSwipedUp = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setPlaying(true);
        setPlayed(0);
    };

    const handleSwipedDown = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
        );
        setPlaying(true);
        setPlayed(0);
        setShowProducts(false);
    };

    const togglePlay = () => {
        setPlaying((prevPlaying) => !prevPlaying);
    };

    const handleVideoClick = (e) => {
        // If click is from the products list, do nothing
        if (e.target.closest(".products-list-container")) {
            return;
        }

        if (showProducts) {
            setShowProducts(false);
            togglePlay();
        } else {
            togglePlay();
        }
    };

    const handleProgress = (state) => {
        setPlayed(state.played);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await getVideos(1, limit);
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
        <div
            ref={containerRef}
            onClick={handleVideoClick}
            className="h-full w-full"
        >
            <div className="relative h-full w-full flex flex-col items-center justify-center bg-black">
                {videos.map((video, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 items-center justify-center transition-opacity duration-500 ${
                            index === currentIndex ? "flex" : "hidden"
                        }`}
                    >
                        {index === currentIndex && (
                            <div className="w-full h-full">
                                <ReactPlayer
                                    url={video.src}
                                    playing={playing}
                                    loop
                                    width="100%"
                                    height="100%"
                                    className="react-player"
                                    onProgress={handleProgress}
                                />
                            </div>
                        )}
                        <div className="flex flex-col absolute bottom-2.5 left-2 gap-y-3">
                            <button
                                className="bg-stone-900 p-1 flex gap-x-2 items-center"
                                onClick={() => setShowProducts(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                                <span className="text-xs">Products</span>
                            </button>
                            <div className="flex flex-col gap-y-1">
                                <span className="font-bold text-base">
                                    Username
                                </span>
                                <span>{video.title}</span>
                            </div>
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
                        <div
                            className={`products-list-container absolute bottom-0 w-full ${
                                showProducts ? "active" : ""
                            }`}
                        >
                            <ProductsList
                                products={[
                                    {
                                        name: "Product 1",
                                        price: "$100",
                                        rating: 4,
                                        itemsSold: 100,
                                    },
                                    {
                                        name: "Product 2",
                                        price: "$200",
                                        rating: 5,
                                        itemsSold: 200,
                                    },
                                    {
                                        name: "Product 3",
                                        price: "$300",
                                        rating: 3,
                                        itemsSold: 300,
                                    },
                                    {
                                        name: "Product 3",
                                        price: "$300",
                                        rating: 3,
                                        itemsSold: 300,
                                    },
                                    {
                                        name: "Product 3",
                                        price: "$300",
                                        rating: 3,
                                        itemsSold: 300,
                                    },
                                ]}
                                onHideProductsList={() =>
                                    setShowProducts(false)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SwipeableVideoList;
