import React, { useState, useRef } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
	const submitRef = useRef(null);
	let navigate = useNavigate();

	const emailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [formError, setFromStatus] = useState("");

	async function handleSubmit(e) {
		submitRef.current.disabled = true;
		e.preventDefault();
		setFromStatus("");

		if (!formData.email || !formData.password) {
			setFromStatus("Please fill in all fields.");
			submitRef.current.disabled = false;
			return;
		}

		if (!emailRegex.test(formData.email)) {
			setFromStatus("Invalid Email !!!");
			submitRef.current.disabled = false;
			return;
		}

		try {
			await axios.post("http://localhost:8080/user/login", formData);
			navigate("/");
		} catch (err) {
			if (err.response.status === 404) {
				setFromStatus("User Not Found.");
			} else if (err.response.status === 401) {
				setFromStatus("Worng Password.");
			} else {
				setFromStatus("An Error Occoured. Try Again Later");
			}
		} finally {
			submitRef.current.disabled = false;
		}
	}

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	return (
		<div className="h-screen flex justify-center items-center bg-[#3081D0]">
			<form className="flex flex-col text-xl items-center gap-4 bg-[#dfdd61] p-4 rounded-md  text-[#33689e]">
				<p className="text-2xl font-bold underline w-full flex justify-center">
					WELCOME BACK!!!
				</p>
				<div className="flex flex-col gap-1">
					<label htmlFor="name">Email</label>
					<input
						className="bg-[#f5eec9] p-1 rounded-md"
						type="email"
						name="email"
						required={true}
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="name">Password</label>
					<input
						className="bg-[#f5eec9] p-1 rounded-md"
						type="password"
						name="password"
						required={true}
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
				{formError && (
					<p className="flex justify-center text-slate-600 underline">
						{formError}
					</p>
				)}
				<div className="bg-sky-400 hover:bg-sky-300 p-2 rounded-md">
					<input
						type="submit"
						value="Login"
						ref={submitRef}
						onClick={handleSubmit}
					/>
				</div>
				<p>
					New User?{"  "}
					<a className="underline" href="/signup">
						SignUp.
					</a>
				</p>
			</form>
		</div>
	);
}
