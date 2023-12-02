import bcrypt from "bcrypt";

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
		.then((result) => {
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
			let password = await bcrypt.compare(
				req.body.password,
				result.password
			);
			if (password) {
				res.status(200).send({ Messege: "Login Sucessful" });
			} else {
				res.status(401).send({ Messege: "Wrong Password" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(404).send({ Messege: "User Not Found" });
		});
};
