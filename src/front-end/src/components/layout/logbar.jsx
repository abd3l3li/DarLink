import { useState } from "react";
import logo from "../ui/logo.svg";
import Bell from "../utils/bell.jsx";
import Logged from "./logged.jsx";
import NotLogged from "./notLogged.jsx";
import Return from "../utils/retutn_home.jsx";


function Logbar({isLoggedIn = false, isCreating = false}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar fixed top-0 w-full z-50 bg-(--color-surface) shadow-md">
            <div className="flex items-center justify-between max-w-[103rem] w-full mx-auto py-2"> 

                <a href="/" className="logo md:block">
                    <img src={logo} alt="Logo" className="h-9 md:h-10 max-[300px]:hidden" draggable={false} />
                </a>
                <a href="/"> 
                            <Return className="cursor-pointer" />
                </a>            
            </div>
        </nav>
    );
}

export default Logbar;
