// import { Outlet } from "react-router-dom";
import Home from "./pages/home.jsx";
import Slots from "./pages/slots.jsx";
// import Footer from "./components/layout/footer.jsx";
import LangButton from "./components/layout/langButton.jsx";

export default function App() {

    return (
    <div className="app">
        <Home />
        <Slots />
        <LangButton />
    </div>
    );
}
