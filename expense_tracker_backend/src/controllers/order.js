import crypto from "crypto";

import Razorpay from "razorpay";

import Order from "../models/orders.js";

export const newOrder = async (req, res) => {
	if (req.user.premium) res.status(500).json("Already a Premium User");
	try {
		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});

		const options = {
			amount: 5000,
			currency: "INR",
			receipt: "receipt_order_74394",
		};

		const order = await instance.orders.create(options);

		if (!order) return res.status(500).send("Some error occured");

		const orderdb = new Order({
			orderCreationId: order.id,
			amount: order.amount,
			currency: order.currency,
			status: "PENDING",
		});
		orderdb.save();

		res.json(order);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
};

export const orderSuccess = async (req, res) => {
	try {
		// getting the details back from our font-end
		const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
		console.log(orderCreationId);

		// Creating our own digest
		// The format should be like this:
		// digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
		const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

		shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

		const digest = shasum.digest("hex");

		// comaparing our digest with the actual signature
		if (digest !== razorpaySignature) {
			await Order.findOneAndUpdate({ orderCreationId: req.body.orderCreationId }, { status: "FAILED" });
			return res.status(400).json({ msg: "Transaction not legit!" });
		}

		// THE PAYMENT IS LEGIT & VERIFIED
		// YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

		await Order.findOneAndUpdate(
			{ orderCreationId: orderCreationId },
			{ razorpayOrderId: razorpayOrderId, razorpayPaymentId: razorpayPaymentId, razorpaySignature: razorpaySignature, status: "SUCCESS" }
		);
		req.user.premium = 1;
		await req.user.save();

		res.json({
			msg: "success",
			orderId: razorpayOrderId,
			paymentId: razorpayPaymentId,
		});
	} catch (error) {
		console.log(error);
		await Order.update({ status: "FAILED" }, { where: { orderCreationId: orderCreationId } }, { transaction: transaction });
		res.status(500).send(error);
	}
};

export const makePremium = async (req, res) => {
	req.user.premium = true;
	req.user.save();
	res.json({ msg: "success" });
};
