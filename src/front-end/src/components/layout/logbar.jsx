import { useState } from "react";
import logo from "../ui/logo.svg";
import Return from "../utils/return_home.jsx";
import { Link } from "react-router-dom";


function Logbar({isLoggedIn = false, isCreating = false}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar fixed top-0 w-full z-50 bg-(--color-surface) shadow-md">
            <div className="flex items-center justify-between max-w-[103rem] w-full mx-auto py-2"> 

                <Link to="/" className="logo md:block">
                    <img src={logo} alt="Logo" className="h-9 md:h-10 max-[300px]:hidden" draggable={false} />
                </Link>
                <Link to="/"> 
                            <Return className="cursor-pointer" />
                </Link>            
            </div>
        </nav>
    );
}

export default Logbar;
