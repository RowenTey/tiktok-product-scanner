import express from "express";
import { signin, signup } from "../controller/user.js";
import User from "../models/user.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/", auth, async (req, res) => {
  const _id = req.userId;
  const user = await User.find({_id: _id});
  if (!user) return res.sendStatus(404);
  res.json(user);
});

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

export default userRouter;
