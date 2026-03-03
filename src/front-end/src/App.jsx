import { stays } from "./components/stays/staysTemp.js";
import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import CreatePost from "./pages/createPost";
import { Provider } from "@/components/ui/provider"
import SlotShow from "./pages/slotShow.jsx";





export default function App() {
  return (
      <div className="app">

        {/* <Home /> */}
          {/* <Slots /> */}
          <LangButton />
          {/* <CreatePost /> */}
          <SlotShow stay={stays[0]} />
      </div>
  );
}
