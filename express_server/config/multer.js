import multer from "multer";

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
