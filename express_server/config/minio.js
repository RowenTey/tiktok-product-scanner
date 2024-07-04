import * as Minio from "minio";

// MinIO configuration
const minioClient = new Minio.Client({
	endPoint: "localhost",
	port: 9000,
	useSSL: false,
	accessKey: "team-cooked",
	secretKey: "admin123",
});

export default minioClient;
