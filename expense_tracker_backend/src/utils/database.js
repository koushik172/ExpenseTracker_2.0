import Sequelize from "sequelize";

const sequelize = new Sequelize("expense_tracker_2.0", "root", "1234", {
	dialect: "mysql",
	host: "localhost",
});

export default sequelize;
