import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications, NOTIFICATION_TYPES } from "./notificationContext";

export default function NotificationDropdown({ isOpen, onClose }) {

    const { notifications, markAsRead, markAllAsRead, refreshNotifications, refreshUnreadCount, loading, error } = useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;
        refreshNotifications();
        refreshUnreadCount();
    }, [isOpen, refreshNotifications, refreshUnreadCount]);

    if (!isOpen) return null;

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);

        switch (notification.type) {
            case NOTIFICATION_TYPES.MESSAGE:
            case "new_message":
                if (notification.link) {
                    navigate(notification.link);
                } else {
                    navigate("/chat");
                }
                break;
                
            case NOTIFICATION_TYPES.FRIEND_REQUEST:
            case NOTIFICATION_TYPES.FRIEND_ACCEPT:
            case NOTIFICATION_TYPES.FRIEND_REJECT:
                if (notification.link) {
                    navigate(notification.link);
                }
                break;

            case NOTIFICATION_TYPES.SLOT_REQUEST:
            case NOTIFICATION_TYPES.SLOT_CONFIRMED:
            case NOTIFICATION_TYPES.SLOT_DECLINED:
                if (notification.link) {
                    navigate(notification.link);
                }
                break;

            default:
                break;
        }
        onClose();
    };

    return (
        <div 
            className="absolute right-0 top-14 w-80 bg-(--color-surface) rounded-2xl shadow-xl 
                        border border-(--color-border-gray) z-50 overflow-hidden"
            data-dropdown
            onClick={(e) => e.stopPropagation()}
        >
            
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border-gray)">
                <button onClick={onClose} className="text-(--color-muted) hover:text-(--color-text)">
                    <span className="text-xl">×</span>
                </button>

                <span className="font-semibold text-(--color-text)">Slot & Notifications</span>

                <div className="w-5"></div>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <p className="font-semibold text-(--color-text)">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <p className="font-semibold text-(--color-text)">Couldn't load notifications</p>
                        <p className="text-sm text-(--color-muted) text-center mt-2">{error}</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <p className="font-semibold text-(--color-text)">No new notifications</p>
                        <p className="text-sm text-(--color-muted) text-center mt-2">
                            You've got a blank state (for now). We will let you know when updates arrive
                        </p>
                    </div>
                ) : (
                    <div className="py-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer 
                                            hover:bg-(--color-bg) transition-colors
                                            ${!notification.read ? "bg-(--color-bg)" : ""}`}
                            >
                                <span className="text-(--color-text) text-sm">
                                    {notification.message}
                                </span>
                                {!notification.read && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full ml-2 shrink-0"></span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="border-t border-(--color-border-gray) px-4 py-2">
                    <button
                        onClick={() => {
                            markAllAsRead();
                        }}
                        className="text-sm text-(--color-secondary) hover:underline"
                    >
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
}
