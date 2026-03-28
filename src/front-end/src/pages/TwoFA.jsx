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
      localStorage.setItem("token", data.token);
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

        <input
          type="text"
          maxLength={6}
          className="w-full p-2 border rounded text-center text-xl tracking-widest"
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        >
          Verify
        </button>

      </div>

    </div>
  );
}