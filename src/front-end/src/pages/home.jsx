import Navbar from "../components/layout/Navbar.jsx";
import Background from "../components/layout/bg.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function Home() {
    return (
        <div className="home h-screen overflow-hidden flex flex-col relative">
            <Navbar isLoggedIn={false} />
            <Background />
        </div>
    );
}