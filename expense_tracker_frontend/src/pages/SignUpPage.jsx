import React, { useState } from "react";
import axios from "axios";

function SignupPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	function handleSubmit(e) {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.password) {
			alert("Please fill in all fields.");
			return;
		}
		try {
			axios.post("http://localhost:3000/user/signup", formData);
		} catch (err) {
			console.log(err);
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
			<form className="flex flex-col items-center gap-4 bg-[#dfdd61] p-4 rounded-md  text-[#33689e]">
				<div className="flex flex-col gap-1">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						name="name"
						required={true}
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="name">Email</label>
					<input
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
						value="Sign Up"
						onClick={handleSubmit}
					/>
				</div>
			</form>
		</div>
	);
}

export default SignupPage;
