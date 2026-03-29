import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const require2fa = params.get("require2fa") === "true";
    const email = params.get("email");

    console.log("token:", token);
    console.log("require2fa:", require2fa);

    if (token) {
      localStorage.setItem("token", token);

      if (require2fa && email) {
        // User has 2FA enabled, redirect to 2FA verification
        localStorage.setItem("pendingEmail", email);
        console.log("2FA required, redirecting to /2fa");
        navigate("/2fa", { replace: true });
      } else {
        // No 2FA, normal login
        console.log("saved token, navigating to /");
        navigate("/", { replace: true });
      }
    } else {
      const stored = localStorage.getItem("token");
      console.log("stored token:", stored);
      if (stored) {
        navigate("/", { replace: true });
      } else {
        navigate("/log-in", { replace: true });
      }
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
}
