import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import CreatePost from "./pages/createPost";
import { Provider } from "@/components/ui/provider"





export default function App() {
  return (
      <div className="app">

        {/* <Home />
          <Slots /> */}
          <LangButton />
          <CreatePost />
      </div>
  );
}
