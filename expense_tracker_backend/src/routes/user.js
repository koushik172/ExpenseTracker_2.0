import express from "express";

import * as userController from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);

userRouter.post("/login", userController.login);

userRouter.post("/add-expense/:id", userController.addExpense);

userRouter.get("/get-expenses/:id", userController.getExpenses);

userRouter.delete("/delete-expense/:id", userController.deleteExpense);

export default userRouter;
