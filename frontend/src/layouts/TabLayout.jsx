import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const TabLayout = () => {
	return (
		<div className="h-full">
			<div className="h-[92.5%]">
				<Outlet />
			</div>
			<Navbar />
		</div>
	);
};

export default TabLayout;
