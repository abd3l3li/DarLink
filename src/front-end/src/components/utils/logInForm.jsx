import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Form_header from "./form_header_2.jsx";
import Log_with from "./logIn_with_2.jsx";
import Form_tag from "./formTag_2.jsx";
import Question_tag from "./question_tag_2.jsx";

export default function Right_side_2() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch("https://localhost:1337/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          const message = data.message;
          if (message === "2FA required") {
            localStorage.setItem("pendingEmail", form.email);
            navigate("/2fa");
            return;
          } else if (message === "2FA setup required") {
            localStorage.setItem("pendingEmail", form.email);
            navigate("/2fa-setup");
            return;
          }
        }
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Login failed"
        );
      }

      // ✅ CASE 1: Normal login
      if (data.token && typeof data.token === "string") {
        localStorage.setItem("token", data.token);
        navigate("/");
      }

      // ✅ CASE 2: 2FA required
      else if (data.token === null) {
        localStorage.setItem("pendingEmail", form.email);
        navigate("/2fa");
      }

      // ❌ unexpected response
      else {
        throw new Error("Unexpected response from server");
      }

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
            {loading ? "..." : "LOG IN"}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-gray-600">
          No account yet?{" "}
          <Link
            to="/sign-up"
            className="text-blue-600 font-medium hover:underline"
          >
            SIGN UP
          </Link>
        </p>

      </div>
    </div>
  );
}