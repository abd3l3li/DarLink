import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import CreatePost from "./pages/createPost";
import SlotShow from "./pages/slotShow.jsx";
import ChatPage from "./pages/chatPage.jsx";
import Sign_in from "./pages/signIn.jsx";
import Log_in from "./pages/logIn.jsx";
import About from "./pages/about.jsx";
import MyListings from "./pages/myListings.jsx";
import NotFound from "./pages/NotFound.jsx";
import Terms from "./components/layout/Terms.jsx";
import Privacy from "./components/layout/Privacy.jsx";
import Contact from "./components/layout/Contact.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import TwoFA from "./pages/TwoFA.jsx";
import TwoFASetup from "./pages/2fa-setup.jsx";
import StatusPage from "./pages/StatusPage.jsx";
import { getStoredToken, handleAuthRejected } from "@/lib/auth.js";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/slots", element: <Slots /> },
      { path: "/create-post", element: <CreatePost /> },
      { path: "/slot-show/:slotId", element: <SlotShow /> },
      { path: "/about", element: <About /> },
      { path: "/my-listings", element: <MyListings /> },
    ],
  },
  {
    path: "/chat",
    element: <ChatPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/chat/:ownerId",
    element: <ChatPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/chat/:ownerId/:stayId",
    element: <ChatPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-up",
    element: <Sign_in />,
    errorElement: <NotFound />,
  },
  {
    path: "/log-in",
    element: <Log_in />,
    errorElement: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/terms",
    element: <Terms />,
    errorElement: <NotFound />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
    errorElement: <NotFound />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <NotFound />,
  },
  {
    path: "/2fa",
    element: <TwoFA />,
    errorElement: <NotFound />,
  }
  ,{
    path: "/2fa-setup",
    element: <TwoFASetup />,
    errorElement: <NotFound />,
  },
  {
    // OPS: public system status page — no auth required
    path: "/status",
    element: <StatusPage />,
    errorElement: <NotFound />,
  }


]);


export default function App() {
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        // If backend was reset, ensure we don't keep a dead token around.
        const redirectTo = window.location.pathname === "/" ? null : "/log-in";
        handleAuthRejected(res, { redirectTo });
      })
      .catch(() => {
        // ignore network errors
      });
  }, []);

  return (
      <div className="app">
        <LangButton />

        <div className="main">
          <RouterProvider router={router} />
        </div>
      </div>
  );
}
