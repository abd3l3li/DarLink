import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import CreatePost from "./pages/createPost";
import SlotShow from "./pages/slotShow.jsx";
import ChatPage from "./pages/chatPage.jsx";
import Sign_in from "./pages/sign_in.jsx";
import Log_in from "./pages/log_in.jsx";
import About from "./pages/about.jsx";
import MyListings from "./pages/myListings.jsx";

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
  },
  {
    path: "/chat/:ownerId/:stayId",
    element: <ChatPage />,
  },
  {
    path: "/sign-up",
    element: <Sign_in />,
  },
  {
    path: "/log-in",
    element: <Log_in />,
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
