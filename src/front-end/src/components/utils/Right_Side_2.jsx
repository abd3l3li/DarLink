import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form_heder from "../utils/form_heder_2.jsx";
import Log_with from "../utils/log_with_2.jsx";
import { Link } from "react-router-dom";

export default function Right_side_2() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		setError("");
		setLoading(true);
		try {
			const res = await fetch("https://localhost:8443/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Login failed");
			localStorage.setItem("token", data.token);
			navigate("/");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex w-full lg:w-1/2 items-center justify-end">
			<div className="w-full max-w-md">
				<Form_heder />
				<Log_with />

				{/* Form Fields */}
				<div className="mt-10 space-y-8">
					<div className="relative">
						<label className="text-sm text-gray-500">Email</label>
						<input name="email" type="email" value={form.email}
							   onChange={handleChange} placeholder="Enter your email"
							   className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none" />
					</div>
					<div className="relative">
						<label className="text-sm text-gray-500">Password</label>
						<input name="password" type="password" value={form.password}
							   onChange={handleChange} placeholder="Enter your password"
							   className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none" />
					</div>
				</div>

				{error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

				{/* Submit */}
				<div className="mt-10">
					<button onClick={handleSubmit} disabled={loading}
							className="bg-[var(--color-primary)] text-[var(--color-surface)] px-4 py-2 flex items-center justify-center rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-11 w-34">
						{loading ? "..." : "LOG IN"}
					</button>
					<p className="mt-6 text-gray-600">
						No account yet?{" "}
						<Link to="/sign-up" className="text-blue-600 font-medium hover:underline">SIGN UP</Link>
					</p>
				</div>
			</div>
		</div>
	);
}