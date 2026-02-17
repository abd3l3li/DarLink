import { useState } from "react";
import RightSide from "./right-side.jsx";
import logo from "../ui/logo.svg";
import bell from "../ui/bell.svg";


function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar bg-[var(--color-surface)] shadow-md">
            <div className="flex items-center justify-between px-5 py-3">

                <a href="/" className="logo  md:block">
                    <img src={logo} alt="Logo" className="h-7 md:h-10 max-[300px]:hidden" />
                </a>

                <ul className="nav-links hidden md:flex gap-7 font-bold text-lg">
                    <li className="duration-300 hover:text-[var(--color-secondary)]"><a href="/">Home</a></li>
                    <li className="duration-300 hover:text-[var(--color-secondary)]"><a href="/slots">Slots</a></li>
                    <li className="duration-300 hover:text-[var(--color-secondary)]"><a href="/about">About</a></li>
                </ul>

                <div className=" hidden md:block">
                    <RightSide />
                </div>

                {/* mobile: bell + hamburger */}
                <div className="flex items-center gap-4 md:hidden">
                    <img 
                        src={bell} 
                        alt="Notifications" 
                        className="h-6 max-[300px]:hidden cursor-pointer hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]" 
                    />
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