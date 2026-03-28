import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TwoFASetup() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQR = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("https://localhost:1337/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setQr(data.qrCodeUrl);
    };

    fetchQR();
  }, []);

  const verify = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://localhost:1337/api/auth/2fa/verify-setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ totpCode: code })
    }).catch(() => alert("Invalid code"));

    if (!res.ok)
      alert("Invalid code");
    else
      navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <h2 className="text-2xl mb-4">Setup 2FA</h2>

      {qr && (
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`}
          alt="QR Code"
        />
      )}

      <input
        type="text"
        placeholder="Enter code"
        onChange={(e) => setCode(e.target.value)}
        className="mt-4 border p-2"
      />

      <button onClick={verify} className="mt-4 bg-green-600 text-white px-4 py-2">
        Verify
      </button>

    </div>
  );
}