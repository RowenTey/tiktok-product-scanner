import Video from "../models/video.js";
import minioClient from "../config/minio.js";
import { sendMessage } from "../config/kafka.js";

export const uploadVideo = async (req, res) => {
	try {
		// Save video to MinIO
		const fileName = `${Date.now()}_${req.file.originalname}`;
		const uploadedRes = await minioClient.putObject(
			"videos",
			fileName,
			req.file.buffer,
			req.file.size
		);
		console.log("Uploaded to MinIO:", uploadedRes);

		// Save metadata to MongoDB using Mongoose
		const video = new Video({
			title: req.body.title,
			fileName: fileName,
			size: req.file.size,
			contentType: req.file.mimetype,
			uploadDate: new Date(),
		});
		await video.save();

		const kafkaData = {
			bucket: "videos",
			fileName: fileName,
		};
		// Send message to Kafka (asynchronously)
		sendMessage("process-video", kafkaData);

		res.status(200).json({ message: "Upload successful" });
	} catch (error) {
		console.error("Upload failed:", error);
		res.status(500).json({ error: "Upload failed" });
	}
};
