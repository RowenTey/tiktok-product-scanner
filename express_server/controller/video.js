import Video from "../models/video.js";
import minioClient from "../config/minio.js";

export const uploadVideo = async (req, res) => {
	try {
		// Save video to MinIO
		const fileName = `${Date.now()}_${req.file.originalname}`;
		await minioClient.putObject("videos", fileName, req.file.buffer);

		// Save metadata to MongoDB using Mongoose
		const video = new Video({
			title: req.body.title,
			fileName: fileName,
			size: req.file.size,
			contentType: req.file.mimetype,
			uploadDate: new Date(),
		});

		await video.save();

		res.status(200).json({ message: "Upload successful" });
	} catch (error) {
		console.error("Upload failed:", error);
		res.status(500).json({ error: "Upload failed" });
	}
};
