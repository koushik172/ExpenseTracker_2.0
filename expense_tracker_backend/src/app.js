import express from "express";

import cors from "cors";

import sequelize from "./utils/database.js";
import User from "./models/user.js";
import Expense from "./models/expense.js";

import userRoutes from "./routes/user.js";

const app = express();

app.use(express.json());
app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);

app.use("/user", userRoutes);

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
