import express from "express";
import { signin, signup } from "../controller/user.js";
import User from "../models/user.js";
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const token = req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    let email = decoded.email;
    const user = await User.findOne({ email });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
});

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

export default userRouter;
