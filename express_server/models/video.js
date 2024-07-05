import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
	title: { type: String, required: true },
	fileName: { type: String, required: true },
	size: { type: Number, required: true },
	contentType: { type: String, required: true },
	uploadDate: { type: Date, required: true },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
