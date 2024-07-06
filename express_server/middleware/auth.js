import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		console.log(token)
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		let decodedData;

		decodedData = jwt.decode(token);
		console.log("decodedData ", decodedData);
		req.userId = decodedData?.id;

		next();
	} catch (error) {
		console.log(error);
	}
};

export default auth;
