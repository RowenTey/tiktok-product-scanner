import express from "express";
import upload from "../config/multer.js";
import { getVideo, uploadVideo } from "../controller/video.js";
import { getProductsByVideoId, scrapeProducts } from "../controller/product.js";
import userRouter from "./user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use("/user", userRouter);

router.get("/videos", getVideo);
router.post("/upload", auth, upload.single("video"), uploadVideo);

router.post("/products", scrapeProducts);
router.get("/products", getProductsByVideoId);

export default router;
