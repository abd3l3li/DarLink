import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../ui/logo.svg";
import Bell from "../utils/bell.jsx";
import Logged from "./logged.jsx";
import NotLogged from "./notLogged.jsx";


function Navbar({isLoggedIn = false, isCreating = false}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar fixed top-0 w-full z-99 bg-[var(--color-surface)] shadow-md">
            <div className="flex items-center justify-between  max-w-[103rem] w-full mx-auto p-3 py-2">

                <Link to="/" className="logo md:block">
                    <img src={logo} alt="Logo" className="h-9 md:h-10 max-[300px]:hidden" draggable={false} />
                </Link>

                <ul className="nav-links hidden md:flex gap-15  max-[1245px]:gap-7 font-bold text-[1rem]">
                    <li className={({ isActive }) => isActive ? "border-b-1 border-[var(--color-secondary)] text-[var(--color-secondary)]" 
                                                                : "transition-all duration-300 hover:border-b-1 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"}>
                        <NavLink to="/">Home</NavLink></li>
                    <li className={({ isActive }) => isActive ? "border-b-1 border-[var(--color-secondary)] text-[var(--color-secondary)]" 
                                                                : "transition-all duration-300 hover:border-b-1 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"}>
                        <NavLink to="/slots">Slots</NavLink></li>
                    <li className={({ isActive }) => isActive ? "border-b-1 border-[var(--color-secondary)] text-[var(--color-secondary)]" 
                                                                : "transition-all duration-300 hover:border-b-1 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"}>
                        <NavLink to="/about">About</NavLink></li>
            
                </ul>

                <div className=" hidden md:block">
                    {isLoggedIn ? <Logged isCreating={isCreating} /> : <NotLogged />}
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
