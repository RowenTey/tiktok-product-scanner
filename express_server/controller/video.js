import Video from "../models/video.js";
import minioClient from "../config/minio.js";
import { sendMessage } from "../config/kafka.js";

const BUCKET_NAME = "videos";

const createBucketIfNotExists = async (bucketName) => {
	try {
		const exists = await minioClient.bucketExists(bucketName);
		if (!exists) {
			await minioClient.makeBucket(bucketName);
			console.log(`Bucket '${bucketName}' created successfully.`);

			// Define bucket policy
			const policy = {
				Version: "2012-10-17",
				Statement: [
					{
						Effect: "Allow",
						Principal: "*",
						Action: ["s3:GetObject"],
						Resource: [`arn:aws:s3:::${bucketName}/*`],
					},
				],
			};

			// Set bucket policy
			await minioClient.setBucketPolicy(
				bucketName,
				JSON.stringify(policy),
			);
			console.log(`Public access policy set for bucket '${bucketName}'.`);
		} else {
			console.log(`Bucket '${bucketName}' already exists.`);
		}
	} catch (error) {
		console.error("Error checking or creating bucket:", error);
		throw error;
	}
};

export const uploadVideo = async (req, res) => {
	try {
		console.log("uploading video");
		// Save video to MinIO
		await createBucketIfNotExists(BUCKET_NAME);
		const fileName = `${Date.now()}_${req.file.originalname}`;
		const uploadedRes = await minioClient.putObject(
			BUCKET_NAME,
			fileName,
			req.file.buffer,
		);
		const presignedUrl = await minioClient.presignedUrl(
			"GET",
			BUCKET_NAME,
			fileName,
			24 * 60 * 60,
		);
		console.log("Uploaded to MinIO:", uploadedRes);

		// Save metadata to MongoDB using Mongoose
		const video = new Video({
			title: req.body.title,
			fileName: fileName,
			size: req.file.size,
			contentType: req.file.mimetype,
			uploadDate: new Date(),
			presignedUrl: presignedUrl,
		});
		await video.save();

		const kafkaData = {
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

		// Get total count of videos
		const total = await Video.countDocuments();

		// Calculate total pages
		const totalPages = Math.ceil(total / limit);
		console.log("getting vidoe", videos);
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
