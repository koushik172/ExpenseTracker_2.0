import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

async function database() {
	await mongoose
		.connect(
			`mongodb+srv://koushik62:${process.env.MONGO_PASSWORD}@cluster0.st9gmr0.mongodb.net/expense-tracker?retryWrites=true&w=majority&appName=Cluster0`
		)
		.catch((err) => {
			console.log(err);
		});
}

export default database;
