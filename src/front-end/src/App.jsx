import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import CreatePost from "./pages/createPost";
import SlotShow from "./pages/slotShow.jsx";
import ChatPage from "./pages/chatPage.jsx";
import Sign_up from "./pages/sign_up.jsx";
import Log_in from "./pages/log_in.jsx";
import About from "./pages/about.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import NotFound from "./pages/NotFund.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> , errorElement: <NotFound />},
      { path: "/slots", element: <Slots />, errorElement: <NotFound /> },
      { path: "/create-post", element: <CreatePost />, errorElement: <NotFound /> },
      { path: "/slot-show/:slotId", element: <SlotShow />, errorElement: <NotFound /> },
      { path: "/about", element: <About />, errorElement: <NotFound /> },
    ],
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
    element: <Sign_up />,
    errorElement: <NotFound />,
  },
  {
    path: "/log-in",
    element: <Log_in />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
]);

export default function App() {
  return (
      <div className="app">
        <LangButton />
        <div className="main">
          <RouterProvider router={router} />
        </div>
      </div>
  );
}