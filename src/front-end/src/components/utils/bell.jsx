import bell from "../ui/bell.svg";
import { useEffect } from "react";
import { useNotifications } from "./notificationContext";
import NotificationDropdown from "./notificationDropdown";
import { useDropdown, DROPDOWN_TYPES } from "./dropdownContext";

export default function Bell({ className = "" }) {
    const { hasUnread, refreshUnreadCount } = useNotifications();
    const { activeDropdown, toggleDropdown, closeDropdown } = useDropdown();
    const isOpen = activeDropdown === DROPDOWN_TYPES.NOTIFICATIONS;

    useEffect(() => {
        refreshUnreadCount();
    }, [refreshUnreadCount]);

    return (
        <div className={`relative ${className}`} data-dropdown>
            <div 
                className="bg-[var(--color-bg)] w-11 h-11 flex items-center justify-center rounded-full cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(DROPDOWN_TYPES.NOTIFICATIONS);
                }}
            >
                <img 
                    src={bell} 
                    alt="Notifications" 
                    className="w-6 h-6 duration-500 
                        hover:[filter:invert(67%)_sepia(52%)_saturate(521%)_hue-rotate(93deg)_brightness(92%)_contrast(89%)]"
                    draggable={false}
                />
                
                {hasUnread && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-bg)]"></span>
                )}
            </div>
            <NotificationDropdown isOpen={isOpen} onClose={closeDropdown} />
        </div>
    );
}