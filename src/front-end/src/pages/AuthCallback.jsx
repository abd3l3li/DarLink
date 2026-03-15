import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("token:", token);

    if (token) {
      localStorage.setItem("token", token);
      console.log("saved token, navigating to /");
      
      navigate("/", { replace: true });
    } else {
      const stored = localStorage.getItem("token");
      console.log("stored token:", stored);
      if (stored) {
        navigate("/", { replace: true });
      } else {
        navigate("/log-in", { replace: true });
      }
    }
  }, []);
  return <div>Logging you in...</div>;
}