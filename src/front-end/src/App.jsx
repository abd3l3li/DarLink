import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import CreatePost from "./pages/createPost";
import SlotShow from "./pages/slotShow.jsx";
import ChatPage from "./pages/chatPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/slots",
    element: <Slots />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/slot-show/:slotId",
    element: <SlotShow />,
  },
  {
    path: "/chat/:ownerId",
    element: <ChatPage />,
  },
  {
    path: "/chat/:ownerId/:stayId",
    element: <ChatPage />,
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
