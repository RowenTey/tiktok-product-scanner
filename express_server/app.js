import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
	.connect("mongodb://localhost:27017/test")
	.then(() => {
		console.log("MongoDB connection is ready");
	})
	.catch((err) => {
		console.log("Error: " + err);
	});

// routes
app.use("/v1", router);
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(5000, () => {
	console.log("Listening at port 5000");
});
