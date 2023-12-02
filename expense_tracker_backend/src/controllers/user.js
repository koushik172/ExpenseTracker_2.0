import User from "../models/user.js";

export const signUp = (req, res) => {
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err.errors);
			res.status(500).send({ error: err });
		});
};

export const login = async (req, res) => {
	await User.findOne({ where: { email: req.body.email } })
		.then((result) => {
			if (result.password === req.body.password) {
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
