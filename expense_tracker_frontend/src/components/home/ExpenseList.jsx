import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function ExpenseList(props) {
	let navigate = useNavigate();

	// To hold the array of expenses
	const [expenses, setExpenses] = useState("");

	async function getExpenses() {
		try {
			let res = await axios.get(`http://localhost:8080/expenses/get-expenses/`, { headers: { Authorization: localStorage.getItem("token") } });
			setExpenses(res.data);
		} catch (err) {
			console.log(err, "get expense error");
			navigate("/login");
		}
	}

	async function deleteExpense(e) {
		let expenseId = e.target.closest("li").id;
		try {
			await axios.delete(`http://localhost:8080/expenses/delete-expense/${expenseId}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			await getExpenses();
			props.setFromStatus("Expense Deleted");
			setTimeout(() => {
				props.setFromStatus("");
			}, 5000);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getExpenses();
	}, []);

	useEffect(() => {
		getExpenses();
	}, [props.formStatus]);

	return (
		<div className="flex flex-col items-center bg-[#dfdd61] text-[#33689e] mx-[5%] rounded-md">
			<ol className="flex flex-col w-full px-[10%] py-[2%] md:text-2xl gap-2">
				{expenses.length === 0 && <li className="flex justify-center">No Records Found</li>}
				{Object.values(expenses).map((element, key) => {
					return (
						<li className="flex justify-between hover:bg-slate-400 items-center p-2 rounded-md" id={element.id} key={key}>
							<p className="flex gap-6">
								<a>{key + 1}.</a>
								{element.amount} - {element.description} - {element.type}
							</p>
							<div className="flex gap-4">
								<button className="text-xl bg-sky-400 hover:bg-sky-300 p-2 rounded-md whitespace-pre"> Edit </button>
								<button className="text-xl bg-red-400 hover:bg-red-300 p-2 rounded-md" onClick={deleteExpense}>
									Delete
								</button>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
