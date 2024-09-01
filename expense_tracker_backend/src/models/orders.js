import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
	orderCreationId: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
	},
	currency: {
		type: String,
	},
	razorpayPaymentId: {
		type: String,
	},
	razorpayOrderId: {
		type: String,
	},
	razorpaySignature: {
		type: String,
	},
	status: {
		type: String,
		required: true,
	},
});

export default mongoose.model("Order", orderSchema);
