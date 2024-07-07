import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VideoUploadPage from "./pages/VideoUploadPage";
import UserPage from "./pages/UserPage";
import TabLayout from "./layouts/TabLayout";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  return (
    <Router>
      <div className="h-dvh w-screen flex items-center justify-center bg-gray-900">
        <div className="w-dvw-md w-[376px] h-full">
            <Routes>
              <Route element={<TabLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<VideoUploadPage />} />
                <Route path="/profile" element={<UserPage />} />
              </Route>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
