import User from "../models/user.js";

export const signUp = (req, res) => {
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	})
		.then((result) => {
			res.send([result, "this"]);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send({ error: err.errors[0].message });
		});
};
