import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
	title: String,
	fileName: String,
	size: Number,
	contentType: String,
	uploadDate: Date,
});

// Create a model from the schema
const Video = mongoose.model("Video", videoSchema);

export default Video;
