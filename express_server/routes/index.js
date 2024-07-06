import express from "express";
import upload from "../config/multer.js";
import { getVideo, uploadVideo } from "../controller/video.js";
import { getProductsByVideoId, scrapeProducts } from "../controller/product.js";
import userRouter from "./user.js";

const router = express.Router();

router.use("/user", userRouter);
router.post("/upload", upload.single("video"), uploadVideo);
router.post("/products", scrapeProducts);
router.get("/products", getProductsByVideoId);
router.get("/videos", getVideo);

export default router;
