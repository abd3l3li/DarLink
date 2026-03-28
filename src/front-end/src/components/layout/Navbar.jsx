import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../ui/logo.svg";
import Bell from "../utils/bell.jsx";
import Logged from "./logged.jsx";
import NotLogged from "./notLogged.jsx";
import User from "../utils/user.jsx";


function Navbar({isLoggedIn = false, isCreating = false}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar fixed top-0 left-0 right-0 z-99 flex-shrink-0 bg-[var(--color-surface)] shadow-md">
            <div className="flex items-center justify-between min-w-0 max-w-[103rem] w-full mx-auto px-4 sm:px-7 py-2">

                <Link to="/" className="logo md:block">
                    <img src={logo} alt="Logo" className="h-9 md:h-10 max-[300px]:hidden" draggable={false} />
                </Link>

                <ul className="nav-links hidden md:flex gap-15 max-[1245px]:gap-7 font-bold text-[1rem]">
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive 
                                    ? "border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)] pb-1" 
                                    : "transition-all duration-300 hover:border-b-2 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] pb-1"
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/slots" 
                            className={({ isActive }) => 
                                isActive 
                                    ? "border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)] pb-1" 
                                    : "transition-all duration-300 hover:border-b-2 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] pb-1"
                            }
                        >
                            Slots
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => 
                                isActive 
                                    ? "border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)] pb-1" 
                                    : "transition-all duration-300 hover:border-b-2 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] pb-1"
                            }
                        >
                            About
                        </NavLink>
                    </li>
                </ul>

                <div className=" hidden md:block">
                    {isLoggedIn ? <Logged isCreating={isCreating} /> : <NotLogged />}
                </div>

                {/* mobile: bell + hamburger */}
                <div className="flex items-center gap-3 md:hidden">
                    {!isLoggedIn && <NotLogged />}

                    {isLoggedIn && (
                        <div className="max-[300px]:hidden">
                            <User />
                        </div>
                    )}
                    {isLoggedIn && <Bell className="md:hidden max-[300px]:hidden"/>}
                    
                    {isLoggedIn && (
                        <button 
                            className="flex flex-col gap-1 p-2 group"
                            onClick={() => setIsOpen(!isOpen)} >

                            <span className={`w-6 h-0.5 bg-[var(--color-text)] group-hover:bg-[var(--color-secondary)] transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-[var(--color-text)] group-hover:bg-[var(--color-secondary)] transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-6 h-0.5 bg-[var(--color-text)] group-hover:bg-[var(--color-secondary)] transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </button>
                    )}
                </div>
                
            </div>

            {/* mobile menu */}
            {isOpen && (
                <div className="md:hidden mt-5 px-5 pb-4">
                    <ul className="flex flex-col gap-4 font-bold text-lg">
                        <li className="hover:text-[var(--color-secondary)]"><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                        <li className="hover:text-[var(--color-secondary)]"><Link to="/slots" onClick={() => setIsOpen(false)}>Slots</Link></li>
                        {/* <li className="hover:text-[var(--color-secondary)]"><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li> */}
                        <li className="hover:text-[var(--color-secondary)]"><Link to="/create-post" onClick={() => setIsOpen(false)}>Create</Link></li>
                        <li className="hover:text-[var(--color-secondary)]"><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>

                    </ul>

                </div>
            )}
        </nav>
    );
}


export default Navbar;
