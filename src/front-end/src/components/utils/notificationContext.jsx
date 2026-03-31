import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { clearStoredAuth, getStoredToken, isAuthRejectedStatus } from "@/lib/auth.js";

const NotificationContext = createContext();

export const NOTIFICATION_TYPES = {
    MESSAGE: "message",
    SLOT_REQUEST: "slot_request",
    SLOT_CONFIRMED: "slot_confirmed",
    SLOT_DECLINED: "slot_declined",
    PROFILE_UPDATE: "profile_update",
    WELCOME: "welcome",
    FRIEND_REQUEST: "friend_request",
    FRIEND_ACCEPT: "friend_accept",
    // more to be added
};

function getApiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || "";
}

function buildApiUrl(path) {
    const base = getApiBaseUrl();
    const url = new URL(`${base}${path}`, window.location.origin);
    return url.toString().replace(window.location.origin, "");
}

function getToken() {
    return getStoredToken();
}

async function parseJsonSafe(res) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

function normalizeNotification(notification) {
    return {
        ...notification,
        read: Boolean(notification?.read ?? notification?.isRead),
    };
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const stompClient = useRef(null);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            read: false,
            timestamp: new Date(),
            ...notification,
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((c) => c + 1);

        // Trigger browser notification if supported
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(newNotification.message, {
                    body: 'Click to view',
                    icon: '/favicon.ico', // or your icon
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(newNotification.message, {
                            body: 'Click to view',
                            icon: '/favicon.ico',
                        });
                    }
                });
            }
        }
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setCurrentUser(null);
            return;
        }

        try {
            const res = await fetch(buildApiUrl("/api/users/me"), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const user = await res.json();
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        } catch {
            setCurrentUser(null);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    useEffect(() => {
        if (!currentUser || !currentUser.email) {
            if (stompClient.current) {
                stompClient.current.deactivate();
                stompClient.current = null;
            }
            return;
        }

        const token = getToken();
        if (!token) return;

        const socketUrl = `${getApiBaseUrl()}/ws`;
        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                console.log("Connected to WebSocket for notifications");
                client.subscribe(`/topic/user.${currentUser.email}`, (message) => {
                    const data = JSON.parse(message.body);
                    // data: { type, roomId, senderUsername }
                    let notification = {
                        type: data.type,
                        message: `${data.senderUsername} sent you a message`,
                        link: `/chat/${data.roomId}`,
                    };
                    addNotification(notification);
                });
            },
            onStompError: (frame) => {
                console.error("Notification WS error: " + frame.headers['message']);
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, [currentUser, addNotification]);

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
            const res = await fetch(buildApiUrl("/api/notifications"), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (isAuthRejectedStatus(res.status)) {
                clearStoredAuth();
                setNotifications([]);
                setUnreadCount(0);
                return;
            }

            const data = await parseJsonSafe(res);
            if (!res.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message || `Failed to load notifications (HTTP ${res.status})`;
                throw new Error(message);
            }

            const list = Array.isArray(data) ? data.map(normalizeNotification) : [];
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

        try {
            const res = await fetch(buildApiUrl("/api/notifications/unread-count"), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (isAuthRejectedStatus(res.status)) {
                clearStoredAuth();
                setUnreadCount(0);
                return;
            }
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

        try {
            const res = await fetch(buildApiUrl(`/api/notifications/read.${id}`), {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                await refreshNotifications();
            }
        } catch {
            await refreshNotifications();
        }
    }, [refreshNotifications]);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);

        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(buildApiUrl("/api/notifications/read"), {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                await refreshNotifications();
                await refreshUnreadCount();
            }
        } catch {
            await refreshNotifications();
            await refreshUnreadCount();
        }
    }, [refreshNotifications, refreshUnreadCount]);

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
