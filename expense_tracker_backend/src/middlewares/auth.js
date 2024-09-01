import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const Authenticate = async (req, res, next) => {
	let token = req.headers.authorization;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.user = await User.findById(decoded.userId);
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json("Unauthorised");
	}
};
