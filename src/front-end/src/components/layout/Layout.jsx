import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./footer.jsx";

export default function Layout() {
  
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return Boolean(token && token !== "undefined" && token !== "null");
  });
  const isCreating = pathname === "/create-post";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token && token !== "undefined" && token !== "null"));
  }, [pathname]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isCreating={isCreating} />
      <Outlet />
      <Footer />
    </>
  );
}
