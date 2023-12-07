import Expense from "../models/expense.js";

import sequelize from "../utils/database.js";

export const addExpense = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		await req.user.createExpense(
			{
				amount: req.body.amount,
				description: req.body.description,
				type: req.body.type,
			},
			{ transaction: transaction }
		);
		let newAmount = parseInt(req.user.total_expense) + parseInt(req.body.amount);
		await req.user.update({ total_expense: newAmount }, { transaction: transaction });
		res.status(201).json({ message: "Expense Added" });
		await transaction.commit();
	} catch (error) {
		console.log(error);
		res.status(500).json("Unknown Error");
		await transaction.rollback();
	}
};

export const getExpenses = async (req, res) => {
	let expenses;
	try {
		expenses = await Expense.findAll({ attributes: ["id", "amount", "description", "type"], where: { userId: req.user.id } });
		res.status(200).json({ expenses: expenses, total_expense: req.user.total_expense });
	} catch (err) {
		console.log(err);
		res.status(404).json("Unknown Error Occoured!");
	}
};

export const deleteExpense = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		let expense = await Expense.findOne({ where: { id: req.params.id } });
		let newAmount = parseInt(req.user.total_expense) - parseInt(expense.amount);
		await req.user.update({ total_expense: newAmount }, { transaction: transaction });
		await expense.destroy({ transaction: transaction });
		res.status(200).json("Expense Deleted");
		await transaction.commit();
	} catch (err) {
		res.status(500).json("Unknown Error.");
		await transaction.rollback();
	}
};
