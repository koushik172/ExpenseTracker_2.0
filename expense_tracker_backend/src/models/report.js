import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
	fileUrl: {
		type: Sequelize.STRING,
		required: true,
	},
	fileName: {
		type: Sequelize.STRING,
		required: true,
	},
});

export default mongoose.model("reportSchema", reportSchema);
