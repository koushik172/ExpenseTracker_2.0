import express from "express";

import * as userController from "../controllers/user.js";
import { Authenticate } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);

userRouter.post("/login", userController.login);

userRouter.post("/add-expense", Authenticate, userController.addExpense);

userRouter.get("/get-expenses", Authenticate, userController.getExpenses);

userRouter.delete("/delete-expense/:id", Authenticate, userController.deleteExpense);

export default userRouter;
