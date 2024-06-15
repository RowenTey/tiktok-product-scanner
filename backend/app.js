import express from "express";
import cors from "cors";
import otherRouter from "./routes/other.js";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/other", otherRouter);

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

app.get("/", (req, res) => {
  res.send("Ok");
});

app.listen(5000, () => {
  console.log("Listening at port 5000");
});
