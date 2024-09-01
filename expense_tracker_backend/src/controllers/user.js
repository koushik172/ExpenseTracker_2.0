import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { Email } from "../utils/email.js";
import ForgotPasswordRequest from "../models/forgotPassword.js";

export const signup = async (req, res) => {
	let hash;

	try {
		hash = await bcrypt.hash(req.body.password, 5);
	} catch (err) {
		res.status(500).send({ Message: "Unknown Error" });
	}

	try {
		let user = await User({
			name: req.body.name,
			email: req.body.email,
			password: hash,
			total_expense: 0,
		});
		await user.save();
		res.status(201).send({ Message: "User Created Sucessfully." });
	} catch (error) {
		console.log(error);
		res.status(409).send({ Message: "User Already Exists." });
	}
};

export const login = async (req, res) => {
	User.findOne({ email: req.body.email })
		.then(async (result) => {
			// password get a binay value to see if it is correct.
			let password = await bcrypt.compare(req.body.password, result.password);
			if (password) {
				const token = jwt.sign({ username: result.name, userId: result.id }, process.env.JWT_SECRET_KEY);
				res.status(200).json({
					Messege: "Login Sucessful",
					username: result.name,
					token: token,
					premium: result.premium,
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

export const forgot_password = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		const forgotPassword = new ForgotPasswordRequest({
			userId: user._id,
		});

		let body = `<p>Click on the link to reset your password</p><p>http://localhost:5173/reset-password/${forgotPassword._id}</p>`;
		let data = { name: user.name, email: user.email, subject: "Password reset request.", body: body };
		await Email(data);

		res.status(200).json("Password reset link sent.");
	} catch (error) {
		console.log(error);
		res.status(500).json("Email doesn't exist.");
	}
};

export const reset_password = async (req, res, next) => {
	let request = await ForgotPasswordRequest.findOne({ _id: req.params.id });
	if (!request) return res.status(401).json("Invalid Request.");

	let user;

	try {
		if (!request.isActive) return res.status(401).json("Link Expired.");
		user = await User.findOne({ _id: request.userId });
	} catch (error) {
		res.status(404).send("Unauthorised");
	}

	let hash;

	try {
		if (req.body.password === req.body.confirmPassword) {
			hash = await bcrypt.hash(req.body.password, 5);
		}
	} catch (err) {
		res.status(500).send("Password and confirm password dont match.");
	}

	try {
		request.isActive = false;
		user.password = hash;

		await request.save();
		await user.save();

		res.status(200).json("Password Change Successful");
	} catch (error) {
		res.status(500).json("Unknown Error");
	}
};

export const is_premuim = (req, res) => {
	console.log(req.user);

	if (req.user.premium === "true") {
		res.status(200).json(true);
	} else {
		res.status(200).json(false);
	}
};

export const leaderboard = async (req, res) => {
	// const results = await sequelize.query(
	// 	"SELECT users.id, users.name, SUM(expenses.amount) as total_expense FROM users INNER JOIN expenses ON users.id = expenses.userId GROUP BY users.id, users.name ORDER BY total_expense DESC LIMIT 0, 100"
	// );
	const users = await User.findAll({
		attributes: ["name", "total_expense"],
		order: [[sequelize.col("total_expense"), "DESC"]],
	});
	res.status(200).json(users);
};
