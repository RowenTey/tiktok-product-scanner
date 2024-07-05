import express from "express";
import upload from "../config/multer.js";
import { uploadVideo } from "../controller/video.js";

const router = express.Router();

router.post("/upload", upload.single("video"), uploadVideo);

export default router;
