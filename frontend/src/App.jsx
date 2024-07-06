import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VideoUploadPage from "./pages/VideoUploadPage";
import Navbar from "./components/Navbar";
import UserPage from "./pages/UserPage";
import SignUp from "./components/SignUp";

const App = () => {
  return (
    <Router>
      <div className="h-dvh w-screen flex items-center justify-center bg-gray-900">
        <div className="w-dvw-md w-[376px] h-full">
          <div className="h-[92.5%]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<VideoUploadPage />} />
              <Route path="/profile" element={<UserPage />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </div>
          <Navbar />
        </div>
      </div>
    </Router>
  );
};

export default App;
