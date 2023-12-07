import Expense from "../models/expense.js";

export const addExpense = async (req, res) => {
	console.log(req.user);
	let response = await req.user.createExpense({
		amount: req.body.amount,
		description: req.body.description,
		type: req.body.type,
	});
	console.log(response);
	res.status(201).json({ message: "Expense Added" });
};

export const getExpenses = async (req, res) => {
	let expenses;
	try {
		expenses = await Expense.findAll({ attributes: ["id", "amount", "description", "type"], where: { userId: req.user.id } });
		res.status(200).json(expenses);
	} catch (err) {
		console.log(err);
		res.status(404).json("Unknown Error Occoured!");
	}
};

export const deleteExpense = async (req, res) => {
	console.log(req.user.id);
	try {
		await Expense.destroy({ where: { id: req.params.id } });
		res.status(200).json("Expense Deleted");
	} catch (err) {
		res.status(500).json("Unknown Error.");
	}
};