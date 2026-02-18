import { useState } from "react";
import RightSide from "./right-side.jsx";
import logo from "../ui/logo.svg";
import bell from "../ui/bell.svg";
import Bell from "../utils/bell.jsx";


function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar bg-[var(--color-surface)] shadow-md">
            <div className="flex items-center justify-between px-7 py-4 gap-7">

                <a href="/" className="logo  md:block">
                    <img src={logo} alt="Logo" className="h-9 md:h-12 max-[300px]:hidden" />
                </a>

                <ul className="nav-links hidden md:flex gap-35 max-[1245px]:gap-7 font-bold text-2xl">
                    <li className="duration-300 hover:text-[var(--color-secondary)]"><a href="/">Home</a></li>
                    <li className="duration-300 hover:text-[var(--color-secondary)]"><a href="/slots">Slots</a></li>
                    <li className="duration-300 hover:text-[var(--color-secondary)]"><a href="/about">About</a></li>
                </ul>

                <div className=" hidden md:block">
                    <RightSide />
                </div>

                {/* mobile: bell + hamburger */}
                <div className="flex items-center gap-4 md:hidden">
                    
                    <Bell className="md:hidden max-[300px]:hidden"/>
                    <button 
                        className="flex flex-col gap-1 p-2 group"
                        onClick={() => setIsOpen(!isOpen)} >

                        <span className={`w-6 h-0.5 bg-[var(--color-text)] group-hover:bg-[var(--color-secondary)] transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-[var(--color-text)] group-hover:bg-[var(--color-secondary)] transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-[var(--color-text)] group-hover:bg-[var(--color-secondary)] transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                </div>
                
            </div>

            {/* mobile menu */}
            {isOpen && (
                <div className="md:hidden mt-5 px-5 pb-4">
                    <ul className="flex flex-col gap-4 font-bold text-lg">
                        <li className="hover:text-[var(--color-secondary)]"><a href="/">Home</a></li>
                        <li className="hover:text-[var(--color-secondary)]"><a href="/slots">Slots</a></li>
                        <li className="hover:text-[var(--color-secondary)]"><a href="/profile">Profile</a></li>
                        <li className="hover:text-[var(--color-secondary)]"><a href="/create">Create</a></li>
                        <li className="hover:text-[var(--color-secondary)]"><a href="/about">About</a></li>
                    </ul>

                </div>
            )}
        </nav>
    );
}


export default Navbar;