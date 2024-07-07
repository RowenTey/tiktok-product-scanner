import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-context";
import Spinner from "./Spinner";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

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
    }, 500);
  });
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
  
  const onLogout = () => {
    logout();
    navigate("/login");
  };

  if (!profile) {
    return <Spinner />;
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md relative">
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="rounded-full h-32 w-32 mb-4"
        />
        <h1 className="text-2xl font-bold mb-4 text-blue-600">{user.name || "Guest"}</h1>
        <ArrowRightStartOnRectangleIcon 
          className="h-8 w-8 absolute top-4 right-4 text-black"
          onClick={onLogout} />
      </div>
        
      <div className={`flex flex-col items-center p-4 ${isLoggedIn ? "" : "h-full justify-center"}`}>
        {
          isLoggedIn ? (
            <>
              <h2 className="text-lg mb-4 text-blue-500 font-bold">Uploaded Videos</h2>
              <div className="flex flex-wrap gap-y-2 justify-between content-start overflow-y-auto">
                {profile.videos.map((video) => (
                  <div key={video._id} className="w-[40%] m-4">
                    <video
                      src={video.url}
                      controls
                      className="w-full h-auto max-w-xs"
                    />
                    <h3 className="text-center mt-2 text-gray-800">{video.title}</h3>
                  </div>
                ))}
              </div>
            </>
          ) : (<h2 className="text-xl text-center text-blue-500 font-bold w-[80%]">Please log in to see your uploaded videos</h2>)
        }
      </div>
    </div>
  );
};

export default Profile;
