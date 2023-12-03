import React, { useState, useRef, useEffect } from "react";

import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function HomePage() {
	// Holds user data passed via url using useNavigate
	const { state } = useLocation();
	const data = state.userData;

	const navigate = useNavigate();

	const submitRef = useRef(false);

	const [expenses, setExpenses] = useState("");

	// To show Erros and Other Messages
	const [formStatus, setFromStatus] = useState("");

	// To handle Form Data
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		type: "",
	});

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e) {
		submitRef.current.disabled = true;
		submitRef.current.classList.add("cursor-wait", "bg-gray-500", "text-sky-300", "hover:bg-gray-500");
		e.preventDefault();
		setFromStatus("");

		if (!formData.name || !formData.description || !formData.type) {
			setFromStatus("Please fill in all fields.");
			submitRef.current.classList.remove("cursor-wait", "bg-gray-500", "text-sky-300", "hover:bg-gray-500");
			submitRef.current.disabled = false;
			return;
		}

		try {
			let res = await axios.post(`http://localhost:8080/user/add-expense/${data.id}`, formData);
			getExpenses();
			console.log(res);
		} catch (err) {
			console.log(err);
		} finally {
			submitRef.current.disabled = false;
			submitRef.current.classList.remove("cursor-wait", "bg-gray-500", "text-sky-300", "hover:bg-gray-500");
		}
	}

	async function getExpenses() {
		try {
			let res = await axios.get(`http://localhost:8080/user/get-expenses/${data.id}`);
			setExpenses(res.data);
		} catch (err) {
			setFromStatus(err.data);
		}
	}

	async function deleteExpense(e) {
		let expenseId = e.target.closest("li").id;
		try {
			await axios.delete(`http://localhost:8080/user/delete-expense/${expenseId}`);
			getExpenses();
		} catch (err) {
			console.log(err);
		}
	}

	// UseEffect to fetch the expenses during the first page load.
	useEffect(() => {
		if (!data) {
			navigate("/login");
		}
		getExpenses();
	}, []);

	useEffect(() => {}, [expenses]);

	return (
		<div className="flex flex-col justify-start bg-[#3081D0] h-screen">
			<form className="flex flex-col items-center bg-[#dfdd61] text-[#33689e] my-[2%] mx-[5%] rounded-md">
				<div className="flex justify-center">
					<p className="p-4 font-bold text-4xl">Welcome {data.username}</p>
				</div>

				<div className="text-xl flex justify-evenly gap-4 px-8 md:px-0 py-4 flex-col md:flex-row w-full">
					<div className="flex flex-col lg:flex-row gap-2">
						<label htmlFor="name" className="p-1 font-semibold">
							Name
						</label>
						<input className="p-1 rounded-md bg-[#f5eec9]" type="text" name="name" value={formData.name} onChange={handleChange} />
					</div>

					<div className="flex flex-col lg:flex-row gap-2">
						<label htmlFor="description" className="p-1 font-semibold">
							Description
						</label>
						<input
							className="p-1 rounded-md bg-[#f5eec9]"
							type="text"
							name="description"
							value={formData.description}
							onChange={handleChange}
						/>
					</div>

					<div className="flex flex-col lg:flex-row gap-2">
						<label htmlFor="type" className="p-1 font-semibold">
							Type
						</label>
						<select className="p-1 rounded-md bg-[#f5eec9]" name="type" id="type" value={formData.type} onChange={handleChange}>
							<option></option>
							<option>Food</option>
							<option>Entertainment</option>
							<option>Clothes</option>
							<option>Travel</option>
							<option>Medical</option>
							<option>Education</option>
						</select>
					</div>
				</div>
				<div>{formStatus && <p className="flex justify-center text-xl text-slate-500 underline">{formStatus}</p>}</div>
				<div>
					<input
						ref={submitRef}
						className="bg-sky-400 hover:bg-sky-300 p-2 rounded-md my-4"
						type="submit"
						value="Add Expense"
						onClick={handleSubmit}
					/>
				</div>
			</form>

			<div className="flex flex-col items-center bg-[#dfdd61] text-[#33689e] mx-[5%] rounded-md">
				<ol className="flex flex-col w-full px-[10%] py-[2%] md:text-2xl gap-2">
					{expenses.length === 0 && <li className="flex justify-center">No Records Found</li>}
					{Object.values(expenses).map((element, key) => {
						return (
							<li className="flex justify-between" id={element.id} key={key}>
								<p>
									{element.name} - {element.description} - {element.type}
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
		</div>
	);
}
