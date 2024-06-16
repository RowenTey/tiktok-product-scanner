import { Link } from "react-router-dom";
import {
	HomeIcon as HomeSolid,
	UserIcon as UserSolid,
} from "@heroicons/react/24/solid";
import {
	HomeIcon as HomeOutline,
	UserIcon as UserOutline,
} from "@heroicons/react/24/outline";
import NavIcon from "./NavIcon";

const Navbar = () => {
	return (
		<nav className="h-[7.5%] p-2 bg-black flex items-center justify-evenly">
			<Link to="/">
				<NavIcon to="/" SolidIcon={HomeSolid} OutlineIcon={HomeOutline} />
			</Link>
			<Link to="/upload">
				<NavIcon to="/upload" SolidIcon={UserSolid} OutlineIcon={UserOutline} />
			</Link>
		</nav>
	);
};

export default Navbar;
