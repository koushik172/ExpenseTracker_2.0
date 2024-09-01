import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	total_expense: { type: Number, required: true },
	premium: { type: String, default: false },
	expenses: [
		{
			description: { type: String, required: true },
			amount: { type: Number, required: true },
			category: { type: String, required: true },
			type: { type: String, required: true },
			date: { type: Date, default: Date.now },
		},
	],
});

export default mongoose.model("User", userSchema);
