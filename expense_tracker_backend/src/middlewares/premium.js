export const Premium = async (req, res, next) => {
	try {
		console.log(req.user.premium);

		if (req.user.premium === "true") {
			return next();
		}
	} catch (error) {
		console.log(error);
		res.status(401).json("Unauthorised");
	}
};
