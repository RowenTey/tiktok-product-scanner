import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VideoUploadPage from "./pages/VideoUploadPage";
import UserPage from "./pages/UserPage";
import SignUp from "./components/SignUp";
import TabLayout from "./layouts/TabLayout";

const App = () => {
  return (
    <Router>
      <div className="h-dvh w-screen flex items-center justify-center bg-gray-900">
        <div className="w-dvw-md w-[376px] h-full">
            <Routes>
              <Route element={<TabLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<VideoUploadPage />} />
              </Route>
              <Route path="/profile" element={<UserPage />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
