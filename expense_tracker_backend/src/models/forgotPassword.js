import mongoose from "mongoose";

const forgotPasswordSchema = mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

export default mongoose.model("ForgotPasswordRequest", forgotPasswordSchema);
