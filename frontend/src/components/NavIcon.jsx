import { useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const NavIcon = ({ to, SolidIcon, OutlineIcon }) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<div className="mx-2 text-white hover:underline flex items-center">
			{isActive ? (
				<SolidIcon className="h-6 w-6" />
			) : (
				<OutlineIcon className="h-6 w-6" />
			)}
		</div>
	);
};

export default NavIcon;
