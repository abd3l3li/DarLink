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

function getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || "https://localhost:1337";
}

function getToken() {
    return localStorage.getItem("token");
}

async function parseJsonSafe(res) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            read: false,
            timestamp: new Date(),
            ...notification,
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((c) => c + 1);
    }, []);

    const refreshNotifications = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        const apiBaseUrl = getApiBaseUrl();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${apiBaseUrl}/api/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await parseJsonSafe(res);
            if (!res.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || `Failed to load notifications (HTTP ${res.status})`;
                throw new Error(message);
            }

            const list = Array.isArray(data) ? data : [];
            setNotifications(list);
            setUnreadCount(list.filter((n) => !n.read).length);
        } catch (err) {
            setError(err.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshUnreadCount = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setUnreadCount(0);
            return;
        }

        const apiBaseUrl = getApiBaseUrl();
        try {
            const res = await fetch(`${apiBaseUrl}/api/notifications/unread-count`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await parseJsonSafe(res);
            if (!res.ok) return;
            const count = typeof data?.count === "number" ? data.count : 0;
            setUnreadCount(count);
        } catch {
            // ignore
        }
    }, []);

    const markAsRead = useCallback(async (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));

        const token = getToken();
        if (!token) return;

        const apiBaseUrl = getApiBaseUrl();
        try {
            await fetch(`${apiBaseUrl}/api/notifications/read.${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch {
            // ignore
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);

        const token = getToken();
        if (!token) return;

        const apiBaseUrl = getApiBaseUrl();
        try {
            await fetch(`${apiBaseUrl}/api/notifications/read`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch {
            // ignore
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const hasUnread = unreadCount > 0;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                refreshNotifications,
                refreshUnreadCount,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
                hasUnread,
                unreadCount,
                loading,
                error,
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
