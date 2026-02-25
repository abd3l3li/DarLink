import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
import LangButton from "./components/layout/langButton.jsx";
import Gallery from "./components/utils/gallery.jsx";

import photos from "@/components/stays/photos.js";




export default function App() {
  return (
    <div className="app">

      {/* <Home />
        <Slots />
        <LangButton /> */}
        <Gallery photos={photos} />
    </div>
  );
}
