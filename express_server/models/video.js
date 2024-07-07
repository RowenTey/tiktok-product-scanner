import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    size: { type: Number, required: true },
    contentType: { type: String, required: true },
    uploadDate: { type: Date, required: true },
    presignedUrl: { type: String, required: false },
    keywords: { type: [String], required: false },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
