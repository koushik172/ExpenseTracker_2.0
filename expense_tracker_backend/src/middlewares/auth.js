import jwt from "jsonwebtoken";

import User from "../models/user.js";

const secretKey = "secretKey";

export const Authenticate = async (req, res, next) => {

	console.log(req.headers);

	let token = req.headers.authorization;
	try {
		const decoded = jwt.verify(token, secretKey);
		req.user = await User.findOne({ where: { id: decoded.userId } });
		next();
	} catch (error) {
		res.status(401).json("Unauthorised");
	}
};
