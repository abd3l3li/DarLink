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
  <div className="min-h-screen flex items-center justify-center px-6">
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm 
        border border-[var(--color-border-gray)] 
        max-w-[1000px] w-full flex items-center justify-between 
        p-16 gap-16">
      <div className="flex-1 flex justify-center">
        {qr && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`}
              alt="QR Code"
              className="w-[260px] object-contain"
              draggable={false}
            />
          )}
      </div>

      <div className="flex-1">
         <h2 className="text-2xl mb-4">Setup 2FA</h2>
         <h4 className=" mb-4"> Scan the QR code with google authenticator app and enter the 6-digit code below to verify.</h4>
          <div className=" mb-4" >
            <input
              type="text"
              placeholder="Enter code"
              onChange={(e) => setCode(e.target.value)}
              className="w-full border-b border-gray-300 py-2 bg-transparent focus:outline-none"

            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={verify}
              className="bg-[var(--color-primary)] text-[var(--color-surface)]
              px-4 py-2 flex items-center justify-center rounded-full font-bold
              transition-all duration-300 h-11 w-34 hover:shadow-lg hover:-translate-y-0.5"
            >
              Verify
            </button>
          </div>
      </div> 
    </div>  
  </div>



    // <div className="min-h-screen flex items-center justify-center px-6">
    //   {/* Card */}
    //   <div className="bg-(--color-surface) rounded-2xl shadow-sm border border-(--color-border-gray) max-w-[1000px] w-full flex flex-col md:flex-row items-center md:items-start justify-between p-8 md:p-12 gap-10">
    //     <div className="w-full md:w-1/2">
    //       <h2 className="text-2xl mb-4">Setup 2FA</h2>

    //       <input
    //         type="text"
    //         placeholder="Enter code"
    //         onChange={(e) => setCode(e.target.value)}
    //         className="mt-4 w-full border border-(--color-border-gray) rounded-lg p-2 bg-transparent text-(--color-text)"
    //       />

    //       <button
    //         onClick={verify}
    //         className="bg-(--color-primary) text-(--color-surface) px-4 py-2 flex items-center justify-center rounded-full font-bold transition-all duration-300 h-11 w-32"
    //       >
    //         Verify
    //       </button>
    //     </div>

    //     <div className="w-full md:w-1/2 flex items-center justify-center">
    //       {qr && (
    //         <img
    //           src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`}
    //           alt="QR Code"
    //           className="h-40 w-40 md:h-56 md:w-56"
    //         />
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}