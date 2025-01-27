import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import { onKeywordsExtracted } from "./services/video.js";
import { connectProducer, runConsumer } from "./config/kafka.js";

const app = express();
app.use(cors(
  {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Origin", "Accept", "Depth", "User-Agent", "X-File-Size", "X-Requested-With", "If-Modified-Since", "X-File-Name", "Cache-Control", "Authorization"],
    exposedHeaders: ["Content-Length", "Content-Range"],
    credentials: true,
    maxAge: 3600
  }
));
// app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/", router);

const initialize = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/test");
    console.log("MongoDB connection is ready");

    // Connect to Kafka producer
    await connectProducer();
    console.log("Kafka producer connected");

    // Run Kafka consumer
    await runConsumer("process-video-complete", onKeywordsExtracted);
    console.log("Kafka consumer is running");

    // Start the server
    app.listen(5000, () => {
      console.log("Listening at port 5000");
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

// Run the initialization
initialize();
