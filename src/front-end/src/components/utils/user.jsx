import { useState, useRef, useEffect } from "react";
import usr from "../ui/usr.svg";
import ProfileDropdown from "./profileDropdown.jsx";

export default function User() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                className="bg-[var(--color-bg)] w-11 h-11 flex items-center justify-center rounded-full cursor-pointer"
                onClick={toggleDropdown}
            >
                <img 
                    src={usr} 
                    alt="User Profile" 
                    className="w-6 h-6 duration-500 
                        hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]" 
                />
            </div>
            <ProfileDropdown 
                isOpen={isDropdownOpen} 
                onClose={() => setIsDropdownOpen(false)} 
            />
        </div>
    );
}