import Video from "../models/video.js";
import { minioClient, createBucketIfNotExists } from "../config/minio.js";
import { sendMessage } from "../config/kafka.js";
import User from "../models/user.js";

const BUCKET_NAME = "videos";

export const uploadVideo = async (req, res) => {
	try {
		console.log("Uploading video");

		// Upload video to MinIO
		await createBucketIfNotExists(BUCKET_NAME);
		const userId = req.userId;
		const fileName = `${userId}/${req.file.originalname}`;
		const uploadedRes = await minioClient.putObject(
			BUCKET_NAME,
			fileName,
			req.file.buffer,
			req.file.size
		);
		const presignedUrl = await minioClient.presignedUrl(
			"GET",
			BUCKET_NAME,
			fileName,
			24 * 60 * 60
		);
		console.log("Uploaded to MinIO:", uploadedRes);

		// Save metadata to MongoDB using Mongoose
		const video = new Video({
			userId,
			title: req.body.title,
			fileName: fileName,
			size: req.file.size,
			contentType: req.file.mimetype,
			uploadDate: new Date(),
			presignedUrl: presignedUrl,
		});
		await video.save();

		const kafkaData = {
			id: video._id,
			bucket: BUCKET_NAME,
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

export const getVideo = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 2;
		const skip = (page - 1) * limit;

		// Fetch videos metadata from MongoDB with pagination
		const videos = await Video.find().skip(skip).limit(limit);

		// find each user of the video
		for (let i = 0; i < videos.length; i++) {
			const userId = videos[i].userId;
			const user = await User.findById(userId);
			videos[i] = { ...videos[i]._doc, username: user.name };
			console.log(videos[i]);
		}

		// Get total count of videos
		const total = await Video.countDocuments();

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);

		res.status(200).json({
			page,
			limit,
			totalPages,
			totalVideos: total,
			videos: videos,
		});
	} catch (error) {
		console.error("Error retrieving videos:", error);
		res.status(500).json({ error: "Error retrieving videos" });
	}
};
