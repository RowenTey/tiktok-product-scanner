import { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import { getProducts, getVideos } from "../api";
import ProductsList from "./ProductsList";

const limit = 2;

const SwipeableVideoList = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [videos, setVideos] = useState([]);
    const [products, setProducts] = useState([]);
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
        [showProducts, videos]
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
        setCurrentIndex((prevIndex) =>(prevIndex + 1) % videos.length);
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
        } else if (e.target.closest(".bg-stone-900")) {
            return;
        }

        togglePlay();
    };

    const handleProgress = (state) => {
        setPlayed(state.played);
    };

    const fetchVideos = async (page) => {
        try {
            const response = await getVideos(page, limit);
            console.log(response.data.videos)
            const newVideos = response.data.videos.map(video => ({
                id: video._id,
                username: video.username,
                src: video.presignedUrl,
                title: video.title,
            }));

            console.log("New Videos", newVideos);
    
            if (newVideos.length === 0) {
                console.log("No more videos found");
                return [];
            }
    
            setTotalPages(response.data.totalPages);
            console.log(`Fetched ${newVideos.length} videos for page ${page}`);
            return newVideos;
        } catch (error) {
            console.error("Error fetching videos:", error);
            return [];
        }
    };
    
    useEffect(() => {
        const initializeVideos = async () => {
            const initialVideos = await fetchVideos(1);
            setVideos(initialVideos);
            if (initialVideos.length > 0) {
                setPlaying(true);
            }
        };
    
        initializeVideos();
    }, []);
    
    // Effect to prefetch next batch
    useEffect(() => {
        const prefetchNextBatch = async () => {
            if (currentIndex === videos.length - 1 && currentPage < totalPages) {
                const nextPage = currentPage + 1;
                const newVideos = await fetchVideos(nextPage);
                setVideos(prevVideos => [...prevVideos, ...newVideos]);
                setCurrentPage(nextPage);
            }
        };
    
        prefetchNextBatch();
    }, [currentIndex, videos.length, currentPage, totalPages]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log("video Id: ", videos[currentIndex].id);
                const resp = await getProducts(videos[currentIndex].id);
                console.log(resp);
                setProducts(resp.data);
                console.log("Products fetched: ", resp.data.length);
                console.log("SUCCESSFUL GET products");
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        
        if (videos.length > 0) {
            setProducts([]);
            fetchProducts();
        }
    }, [currentIndex, videos]);

    return (
        <div
            ref={containerRef}
            onClick={handleVideoClick}
            className="h-full w-full"
        >
            <div className="relative h-full w-full flex flex-col items-center justify-center bg-gray-900">
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
                            {products.length > 0 && (
                                <button
                                    className="w-fit bg-stone-900 p-2 flex gap-x-2 items-center rounded-xl"
                                    onClick={() => {setShowProducts(true)}}
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
                            )}
                            <div className="flex flex-col gap-y-1">
                                <span className="font-bold text-base">
                                    {video.username || "Anonymous"}
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
                                products={products}
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
