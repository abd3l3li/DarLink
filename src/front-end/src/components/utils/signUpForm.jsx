import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Form_header from "./form_header.jsx";
import Log_with from "./logIn_with.jsx";
import Form_tag from "./formTag.jsx";
import Question_tag from "./question_tag.jsx";

export default function Right_side() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent reload

    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://localhost:1337/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Registration failed"
        );
      }

      // ✅ Save token safely
      if (data.token && typeof data.token === "string") {
        localStorage.setItem("token", data.token);
      } else {
        throw new Error("No token received from server");
      }

      // 🚀 Redirect to 2FA setup (IMPORTANT)
      navigate("/2fa-setup");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full lg:w-1/2 items-center justify-center lg:justify-end px-4 sm:px-6">
      <div className="w-full max-w-md">

        <Form_header />
        <Log_with />

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-8">

          {/* Username */}
          <div className="relative">
            <label className="text-sm text-gray-500">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-sm text-gray-500">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-500">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-[var(--color-primary)] text-[var(--color-surface)]
            px-4 py-2 flex items-center justify-center rounded-full font-bold
            transition-all duration-300 h-11 w-34
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5"}`}
          >
            {loading ? "..." : "SIGN UP"}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/log-in"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}