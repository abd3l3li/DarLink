import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
  }


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
