import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const require2fa = params.get("require2fa") === "true";
    const setup2fa = params.get("setup2fa") === "true";
    const email = params.get("email");

    console.log("token:", token);
    console.log("require2fa:", require2fa);
    console.log("setup2fa:", setup2fa);

    if (token) {
      if (require2fa && email) {
  // existing user has 2FA enabled, store token temporarily and redirect to 2FA verification
        sessionStorage.setItem("tempToken", token);
        localStorage.setItem("pendingEmail", email);
        console.log("2FA required, redirecting to /2fa");
        navigate("/2fa", { replace: true });
      } else if (setup2fa && email) {
  // user needs to setup 2FA first
        sessionStorage.setItem("tempToken", token);
        localStorage.setItem("pendingEmail", email);
        console.log("2FA setup required, redirecting to /2fa-setup");
        navigate("/2fa-setup", { replace: true });
      } else {
  // no 2FA, save token to localStorage and navigate to home
        localStorage.setItem("token", token);
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
