import React, { useState, useRef } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
	const submitRef = useRef(null);
	let navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	async function handleSubmit(e) {
		submitRef.current.disabled = true;
		e.preventDefault();
		if (!formData.email || !formData.password) {
			alert("Please fill in all fields.");
			return;
		}
		try {
			await axios.post("http://localhost:8080/user/login", formData);
			navigate("/");
		} catch (err) {
            console.log(err);
			alert(err.response.data.error.toUpperCase());
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
				<p className="text-2xl font-bold underline w-full flex justify-center mb-4">
					WELCOME BACK !!!
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
						Sign Up.
					</a>
				</p>
			</form>
		</div>
	);
}

export default LoginPage;
