import express from "express";
import upload from "../config/multer.js";
import { getVideo, uploadVideo } from "../controller/video.js";

const router = express.Router();

router.post("/upload", upload.single("video"), uploadVideo);
router.get("/videos", getVideo);

export default router;
