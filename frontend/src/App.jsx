import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";

const App = () => {
	return (
		<Router>
			<div className="h-dvh w-screen flex items-center justify-center bg-gray-800">
				<div className="w-dvw-md w-[376px] h-full">
					<div className="h-[90%]">
						<Routes>
							<Route path="/" element={<HomePage />} />
						</Routes>
					</div>
					<nav className="h-[10%] p-2 bg-gray-200 flex items-center">
						<Link to="/" className="mx-2 text-blue-500 hover:underline">
							Home
						</Link>
					</nav>
				</div>
			</div>
		</Router>
	);
};

export default App;
