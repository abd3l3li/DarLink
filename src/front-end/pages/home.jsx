import Navbar from "../components/layout/Navbar.jsx";
import Background from "../components/ui/home-bg.svg";


export default function Home() {
    return (
        <div className="home  overflow-hidden flex flex-col">
            <Navbar />
            <div className="flex items-end justify-center mt-12 ">
                <img src={Background} alt="Background" className="w-full h-auto" />
            </div>
        </div>
    );
}