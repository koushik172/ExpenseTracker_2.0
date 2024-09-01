import mongoose from "mongoose";

const expenseSchema = mongoose.Schema({
	description: { type: String, required: true },
	amount: { type: Number, required: true },
	category: { type: String, required: true },
	type: { type: String, required: true },
	date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", expenseSchema)