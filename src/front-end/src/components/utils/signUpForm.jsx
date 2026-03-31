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

  const getReadableErrorMessage = ({ res, data, fallback }) => {
    if (!res) {
      return "Can't reach the server. Check your connection and try again.";
    }

    const rawMessage =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "";

    switch (res.status) {
      case 422:
        return rawMessage || "Please check your details and try again.";
      case 403:
        return "You are not allowed to register right now. Please try again.";
      case 409:
        return rawMessage || "This email is already in use. Try logging in instead.";
      case 413:
        return "Your request is too large. Try a shorter input and retry.";
      case 504:
        return "Server error. Please try again in a moment.";
      default:
        return rawMessage || fallback || `Registration failed (HTTP ${res.status}).`;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await res.text().catch(() => "");
      const data = text ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })() : null;

      if (!res.ok) {
        throw new Error(getReadableErrorMessage({ res, data, fallback: "Registration failed." }));
      }

      if (data.token && typeof data.token === "string") {
        localStorage.setItem("token", data.token);
      } else {
        throw new Error("No token received from server");
      }

      navigate("/");

    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full lg:w-1/2 items-center justify-center lg:justify-end px-4 sm:px-6">
      <div className="w-full max-w-md">

        <Form_header />
        <Log_with />

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">

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

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-(--color-primary) text-(--color-surface)
            px-4 py-2 flex items-center justify-center rounded-full font-bold
            transition-all duration-300 h-11 w-32
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5"}`}
          >
            {loading ? "..." : "SIGN UP"}
          </button>

        </form>

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