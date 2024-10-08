import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";

import express from "express";

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import database from "./utils/database.js";

import userRoutes from "./routes/user.js";
import expenseRouter from "./routes/expense.js";
import orderRouter from "./routes/order.js";
// import reportRouter from "./routes/report.js";

const app = express();
dotenv.config();

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/user", userRoutes);
app.use("/expenses", expenseRouter);
app.use("/orders", orderRouter);
// app.use("/user/report", reportRouter);

await database()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`http://localhost:${process.env.PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
