import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const isLoggedIn = pathname !== "/" && pathname !== "/about";
  const isCreating = pathname === "/create-post";

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isCreating={isCreating} />
      <Outlet />
      <Footer />
    </>
  );
}
