import express from "express";

import cors from "cors";
import dotenv from "dotenv";

import sequelize from "./utils/database.js";
import User from "./models/user.js";
import Expense from "./models/expense.js";
import Order from "./models/orders.js";
import ForgotPasswordRequest from "./models/forgotPassword.js";

import userRoutes from "./routes/user.js";
import expenseRouter from "./routes/expense.js";
import orderRouter from "./routes/order.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

app.use("/user", userRoutes);
app.use("/expenses", expenseRouter);
app.use("/orders", orderRouter);

const port = 8080;

sequelize
	.sync()
	.then(() => {
		app.listen(port, () => {
			console.log(`http://localhost:${port}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
