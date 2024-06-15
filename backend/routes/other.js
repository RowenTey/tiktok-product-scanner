import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("hello from other routes");
});
export default router;
