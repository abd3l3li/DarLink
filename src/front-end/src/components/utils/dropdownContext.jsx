import { createContext, useContext, useState, useCallback, useEffect } from "react";

const DropdownContext = createContext();

export const DROPDOWN_TYPES = {
    NONE: null,
    NOTIFICATIONS: "notifications",
    PROFILE: "profile",
    MOBILE_MENU: "mobile-menu",
};

export function DropdownProvider({ children }) {
    const [activeDropdown, setActiveDropdown] = useState(DROPDOWN_TYPES.NONE);

    const openDropdown = useCallback((type) => {
        setActiveDropdown(type);
    }, []);

    const closeDropdown = useCallback(() => {
        setActiveDropdown(DROPDOWN_TYPES.NONE);
    }, []);

    const toggleDropdown = useCallback((type) => {
        setActiveDropdown((prev) => (prev === type ? DROPDOWN_TYPES.NONE : type));
    }, []);

    // close any open dropdown when the user clicks outside it.
    useEffect(() => {
        const handleGlobalClick = (e) => {
            
            const isInsideDropdown = e.target.closest('[data-dropdown]');
            if (!isInsideDropdown && activeDropdown !== DROPDOWN_TYPES.NONE) {
                setActiveDropdown(DROPDOWN_TYPES.NONE);
            }
        };
        document.addEventListener("click", handleGlobalClick);
        
        return () => document.removeEventListener("click", handleGlobalClick);
    }, [activeDropdown]);

    return (
        <DropdownContext.Provider
            value={{
                activeDropdown,
                openDropdown,
                closeDropdown,
                toggleDropdown,
            }}
        >
            {children}
        </DropdownContext.Provider>
    );
}

export function useDropdown() {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error("useDropdown must be used within a DropdownProvider");
    }
    return context;
}
