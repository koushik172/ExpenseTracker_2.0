import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Expense from "../models/expense.js";

const secretKey = "secretKey";

export const signUp = async (req, res) => {
	let hash;

	try {
		hash = await bcrypt.hash(req.body.password, 5);
	} catch (err) {
		res.status(500).send({ Message: "Unknown Error" });
	}

	User.create({
		name: req.body.name,
		email: req.body.email,
		password: hash,
	})
		.then(() => {
			res.status(201).send({ Message: "User Created Sucessfully." });
		})
		.catch((err) => {
			console.log(err.errors);
			res.status(500).send({ Message: "User Already Exists." });
		});
};

export const login = async (req, res) => {
	User.findOne({ where: { email: req.body.email } })
		.then(async (result) => {
			// password get a binay value to see if it is correct.
			let password = await bcrypt.compare(req.body.password, result.password);
			if (password) {
				const token = jwt.sign({ username: result.name, userId: result.id }, secretKey);
				res.status(200).json({
					Messege: "Login Sucessful",
					username: result.name,
					token: token,
				});
			} else {
				res.status(401).send({ Messege: "Wrong Password" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(404).send({ Messege: "User Not Found" });
		});
};

export const addExpense = async (req, res) => {
	console.log(req.user);
	let response = await req.user.createExpense({
		name: req.body.name,
		description: req.body.description,
		type: req.body.type,
	});
	console.log(response);
	res.status(201).json({ message: "Expense Added" });
};

export const getExpenses = async (req, res) => {
	let expenses;
	try {
		expenses = await Expense.findAll({ where: { userId: req.user.id } });
		res.status(200).json(expenses);
	} catch (err) {
		res.status(404).json("Unknown Error Occoured!");
	}
};

export const deleteExpense = async (req, res) => {
	try {
		await Expense.destroy({ where: { id: req.params.id } });
		res.status(200).json("Expense Deleted");
	} catch (err) {
		res.status(500).json("Unknown Error.");
	}
};
