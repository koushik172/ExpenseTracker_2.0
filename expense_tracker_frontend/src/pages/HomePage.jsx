import React, { useState, useRef, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import BuyPremium from "../components/home/BuyPremiun";
import ExpenseList from "../components/home/ExpenseList";
import Leaderboard from "../components/home/Leaderboard";

export default function HomePage() {
	const navigate = useNavigate();

	const submitRef = useRef(false);

	const [username, setUsername] = useState("");

	// To show Erros and Other Messages
	const [formStatus, setFromStatus] = useState("");

	// To handle Form Data
	const [formData, setFormData] = useState({
		amount: "",
		description: "",
		type: "",
	});

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	async function addExpense(e) {
		submitRef.current.disabled = true;
		submitRef.current.classList.add("cursor-wait", "bg-gray-500", "text-sky-300", "hover:bg-gray-500");
		e.preventDefault();
		setFromStatus("");

		if (!formData.amount || !formData.description || !formData.type) {
			setFromStatus("Please fill in all fields.");
			submitRef.current.classList.remove("cursor-wait", "bg-gray-500", "text-sky-300", "hover:bg-gray-500");
			submitRef.current.disabled = false;
			setTimeout(() => {
				setFromStatus("");
			}, 5000);
			return;
		}

		try {
			await axios.post(`http://localhost:8080/expenses/add-expense/`, formData, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			setFromStatus("New Expense Added");
		} catch (err) {
			console.log(err);
		} finally {
			submitRef.current.disabled = false;
			submitRef.current.classList.remove("cursor-wait", "bg-gray-500", "text-sky-300", "hover:bg-gray-500");
			setTimeout(() => {
				setFromStatus("");
			}, 5000);
		}
	}

	function logout() {
		localStorage.clear();
		navigate("/login");
	}

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/login");
		}
		setUsername(localStorage.getItem("username"));
	}, []);

	return (
		<div className="flex flex-col bg-[#3081D0] h-screen">
			{/* Form to add new expenses */}
			<form className="flex flex-col bg-[#dfdd61] text-[#33689e] mt-[2%] mx-[5%] rounded-md">
				<div className="flex items-center justify-center">
					<p className="p-4 font-bold text-4xl flex">Welcome {username}</p>
					<BuyPremium />
				</div>

				<div className="text-xl flex justify-evenly gap-4 px-8 md:px-0 py-4 flex-col md:flex-row w-full">
					<div className="flex flex-col lg:flex-row gap-2">
						<label htmlFor="amount" className="p-1 font-semibold">
							Amount
						</label>
						<input className="p-1 rounded-md bg-[#f5eec9]" type="number" name="amount" value={formData.amount} onChange={handleChange} />
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

				<div>
					<p className="flex justify-center text-xl text-slate-500 underline whitespace-pre">{formStatus}</p>
				</div>

				<div className="flex justify-center">
					<input
						ref={submitRef}
						className="bg-sky-400 hover:bg-sky-300 p-2 rounded-md my-4"
						type="submit"
						value="Add Expense"
						onClick={addExpense}
					/>
				</div>
			</form>

			<Leaderboard />

			<ExpenseList formStatus={formStatus} setFromStatus={setFromStatus} />

			<div className="flex justify-center items-center">
				<button className="text-xl text-red-900 bg-red-400 hover:bg-red-300 p-2 w-fit rounded-md m-4" onClick={logout}>
					Logout
				</button>
			</div>

			<p className="whitespace-pre"> </p>
		</div>
	);
}
