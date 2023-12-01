import express from "express";

import * as userController from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/signUp", userController.signUp);

export default userRouter;
