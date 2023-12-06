import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import sequelize from "../utils/database.js";
import User from "../models/user.js";

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
				const token = jwt.sign({ username: result.name, userId: result.id }, process.env.JWT_SECRET_KEY);
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

export const isPremuim = (req, res) => {
	if (req.user.premium === true) {
		res.status(200).json(true);
	} else {
		res.status(200).json(false);
	}
};

export const leaderboard = async (req, res) => {
	if (!req.user.premium) return res.status(401).json("Unauthorised");
	const results = await sequelize.query(
		"SELECT users.id, users.name, SUM(expenses.amount) as total_expense FROM users INNER JOIN expenses ON users.id = expenses.userId GROUP BY users.id, users.name ORDER BY total_expense DESC LIMIT 0, 100"
	);
	res.status(200).json(results[0]);
};
