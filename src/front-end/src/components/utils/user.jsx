import usr from "../ui/usr.svg";
import ProfileDropdown from "./profileDropdown.jsx";
import { useDropdown, DROPDOWN_TYPES } from "./dropdownContext.jsx";

export default function User() {
    const { activeDropdown, toggleDropdown, closeDropdown } = useDropdown();
    const isDropdownOpen = activeDropdown === DROPDOWN_TYPES.PROFILE;

    return (
        <div className="relative" data-dropdown>
            <div 
                className="bg-[var(--color-bg)] w-11 h-11 flex items-center justify-center rounded-full cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(DROPDOWN_TYPES.PROFILE);
                }}
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
                onClose={closeDropdown} 
            />
        </div>
    );
}