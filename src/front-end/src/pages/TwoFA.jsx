import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TwoFA() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    const email = localStorage.getItem("pendingEmail");

    const res = await fetch("https://localhost:1337/api/auth/2fa/verify-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        totpCode: code
      })
    });

    const data = await res.json();

    if (data.token) {
  // save token to localStorage only after successful 2FA verification
      localStorage.setItem("token", data.token);
      sessionStorage.removeItem("tempToken");
      localStorage.removeItem("pendingEmail");
      navigate("/");
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-80 text-center">

        <h2 className="text-2xl font-bold mb-4">
          Enter 2FA Code
        </h2>
        <div className="relative mb-4">
            <input
              type="text"
              maxLength={6}
              className="w-full border-b border-gray-300 py-2  bg-transparent focus:outline-none"
              onChange={(e) => setCode(e.target.value)}
            />
        </div>
       <div className="flex justify-center mt-6">
        <button
          onClick={handleVerify}
          className="bg-[var(--color-primary)] text-[var(--color-surface)]
            px-4 py-2 flex items-center justify-center rounded-full font-bold
            transition-all duration-300 h-11 w-34 hover:shadow-lg hover:-translate-y-0.5"
        >
          Verify
        </button>
      </div>
      </div>

    </div>
  );
}