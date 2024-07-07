import * as Minio from "minio";

// MinIO configuration
export const minioClient = new Minio.Client({
	endPoint: "localhost",
	port: 9000,
	useSSL: false,
	accessKey: "team-cooked",
	secretKey: "admin123",
});

export const createBucketIfNotExists = async (bucketName) => {
	const exists = await minioClient.bucketExists(bucketName);
	if (exists) {
		console.log(`Bucket '${bucketName}' already exists.`);
		return;
	}

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
	await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
	console.log(`Public access policy set for bucket '${bucketName}'.`);
};

