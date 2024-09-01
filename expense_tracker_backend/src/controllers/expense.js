import Expense from "../models/expense.js";

export const addExpense = async (req, res) => {
	try {
		let expense = new Expense({
			amount: req.body.amount,
			description: req.body.description,
			type: req.body.type,
			category: req.body.category,
		});

		let newTotal;
		let newAmount = parseInt(req.body.amount);
		if (req.body.type === "Expense") {
			newTotal = parseInt(req.user.total_expense) - newAmount;
		} else {
			newTotal = parseInt(req.user.total_expense) + newAmount;
		}

		req.user.expenses.push(expense);
		req.user.total_expense = newTotal;

		req.user.save();
		res.status(201).json({ message: "Expense Added" });
	} catch (error) {
		console.log(error);
		res.status(500).json("Unknown Error");
	}
};

export const getExpenses = async (req, res) => {
	if (req.params.page < 1) return res.status(404).json("Not Found");
	// let offset = (req.params.page - 1) * req.params.rows;
	try {
		// const { count, rows } = await Expense.findAndCountAll({
		// 	attributes: ["id", "amount", "description", "category", "type", "createdAt"],
		// 	where: { userId: req.user.id },
		// 	order: [["createdAt", "DESC"]],
		// 	offset: offset,
		// 	limit: parseInt(req.params.rows),
		// });
		res.status(200).json({ expenses: req.user.expenses, total_expense: req.user.total_expense, count: req.user.expenses.length });
	} catch (err) {
		console.log(err);
		res.status(404).json("Unknown Error Occoured!");
	}
};

export const deleteExpense = async (req, res) => {
	try {
		// let expense = await Expense.findOne({ where: { id: req.params.id } });
		const expense = req.user.expenses.id(req.params.id);
		req.user.expenses.pull({ _id: req.params.id });

		let newTotal;
		if (expense.type === "Expense") {
			newTotal = parseInt(req.user.total_expense) + parseInt(expense.amount);
		} else {
			newTotal = parseInt(req.user.total_expense) - parseInt(expense.amount);
		}

		req.user.total_expense = newTotal;
		req.user.save();

		res.status(200).json("Expense Deleted");
	} catch (err) {
		console.log(err);
		res.status(500).json("Unknown Error.");
	}
};
