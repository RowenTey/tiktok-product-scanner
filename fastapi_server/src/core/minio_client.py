from minio import Minio
from minio.error import S3Error 

class MinioClient:
    def __init__(self, endpoint, access_key, secret_key):
        self.client = None
        self.endpoint = endpoint
        self.access_key = access_key
        self.secret_key = secret_key

    def connect(self):
        try:
            self.client = Minio(
                self.endpoint,
                access_key=self.access_key,
                secret_key=self.secret_key,
                secure=False
            )
            print("Connected to MinIo!")
        except Exception as e:
            print("Error connecting to MinIO")

    def bucket_exists(self, bucket_name):
        """Check if a bucket exists."""
        try:
            return self.client.bucket_exists(bucket_name)
        except S3Error as e:
            print(f"Error checking if bucket exists: {e}")
            return False


    def create_bucket(self, bucket_name):
        """Create a new bucket."""
        try:
            if not self.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)
                print(f"Bucket '{bucket_name}' created successfully")
            else:
                print(f"Bucket '{bucket_name}' already exists")
        except S3Error as e:
            print(f"Error creating bucket: {e}")


    def upload_file(self, bucket_name, file_path, object_name):
        """Upload a file to the bucket."""
        try:
            self.client.fput_object(bucket_name, object_name, file_path)
            print(f"File '{file_path}' uploaded successfully as '{object_name}'")
        except S3Error as e:
            print(f"Error uploading file: {e}")


    def download_file(self, bucket_name, object_name, file_path):
        """Download a file from the bucket."""
        try:
            self.client.fget_object(bucket_name, object_name, file_path)
            print(f"File '{object_name}' downloaded successfully to '{file_path}'")
        except S3Error as e:
            print(f"Error downloading file: {e}")


    def list_objects(self, bucket_name):
        """List objects in the bucket."""
        try:
            objects = self.client.list_objects(bucket_name)
            for obj in objects:
                print(obj.object_name)
        except S3Error as e:
            print(f"Error listing objects: {e}")


minioClient = MinioClient(  
    endpoint='10.2.1.15:9000',
    access_key='team-cooked',
    secret_key='admin123'
)

if __name__ == '__main__':
    minioClient.connect()
    minioClient.download_file("videos", "1720192124392_rl-video-episode-0.mp4", "")