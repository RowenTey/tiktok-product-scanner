/* eslint-disable react/prop-types */
const Spinner = ({
	bgClass = "bg-inherit",
	spinnerColor = "border-white",
	spinnerSize = { width: "w-32", height: "h-32" },
}) => (
	<div className={`h-full flex justify-center items-center ${bgClass}`}>
		<div
			className={`animate-spin rounded-full ${spinnerSize.height} ${spinnerSize.width} border-t-2 border-b-2 ${spinnerColor}`}
		></div>
	</div>
);

export default Spinner;