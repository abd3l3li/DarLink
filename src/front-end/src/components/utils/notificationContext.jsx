import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const NOTIFICATION_TYPES = {
    MESSAGE: "message",
    SLOT_REQUEST: "slot_request",
    SLOT_CONFIRMED: "slot_confirmed",
    SLOT_DECLINED: "slot_declined",
    PROFILE_UPDATE: "profile_update",
    WELCOME: "welcome",
    // more to be added
};

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            read: false,
            timestamp: new Date(),
            ...notification,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    }, []);

    
    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const hasUnread = notifications.some((n) => !n.read);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
                hasUnread,
                unreadCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
