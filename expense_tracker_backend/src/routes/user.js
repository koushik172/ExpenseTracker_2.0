import express from "express";

import * as userController from "../controllers/user.js";
import { Authenticate } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);

userRouter.post("/login", userController.login);

userRouter.get("/is-premium", Authenticate, userController.isPremuim);

userRouter.get("/leaderboard", Authenticate, userController.leaderboard);

export default userRouter;
