import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import { onKeywordsExtracted } from "./services/video.js";
import { connectProducer, runConsumer } from "./config/kafka.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect("mongodb://localhost:27017/test")
    .then(() => {
        console.log("MongoDB connection is ready");
    })
    .catch((err) => {
        console.log("Error: " + err);
    });

// connect to kafka
connectProducer()
	.then(() => {
		console.log("Kafka producer connected");
	})
	.catch((err) => {
		console.error("Error connecting Kafka producer:", err);
	});

// routes
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/", router);

app.listen(5000, async () => {
    console.log("Listening at port 5000");

    // run kafka consumer as background process
    try {
        await runConsumer("process-video-complete", onKeywordsExtracted);
        console.log("Kafka consumer is running");
    } catch (error) {
        console.error("Error running consumer:", error);
    }
});
