import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./footer.jsx";
import { getStoredToken } from "@/lib/auth.js";

export default function Layout() {
  
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(getStoredToken());
  });
  const isCreating = pathname === "/create-post";

  useEffect(() => {
    const onAuthChanged = () => setIsLoggedIn(Boolean(getStoredToken()));
    window.addEventListener("darl:auth-changed", onAuthChanged);
    return () => window.removeEventListener("darl:auth-changed", onAuthChanged);
  }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(getStoredToken()));
  }, [pathname]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isCreating={isCreating} />
      <Outlet />
      <Footer />
    </>
  );
}
