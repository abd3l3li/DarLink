import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Return from "../components/utils/return_home.jsx";
import { useState, useRef, useEffect, useMemo } from "react";
import { getStoredToken } from "@/lib/auth.js";
import { fetchRooms, fetchRoomSummaries, fetchMessages, ensureRoom, fetchRoomBetween, fetchMe, fetchStaysByHostId, markRoomUnreadAsRead } from "@/lib/chatApi.js";
import { fetchStayById } from "@/lib/staysApi.js";
import { fetchFriendStatuses, sendFriendRequest, acceptFriendRequest, deleteFriendRequest, unfriendUser } from "@/lib/friendApi.js";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Helper functions

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatJoinedDate(value) {
  if (!value) return "Unknown";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "Unknown";
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Avatar({ name, online, image }) {
  return (
    <div className="relative">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border border-[var(--color-border-gray)]"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 text-[var(--color-primary)] flex 
                          items-center justify-center font-semibold text-sm">
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full 
                          bg-[var(--color-secondary)] border-2 border-[var(--color-surface)]" />
      )}
    </div>
  );
}

function FriendButton({ status, onAction, disabled }) {
  const config = {
    friend: { label: "Delete", action: "unfriend", color: "bg-red-500 hover:bg-red-600" },
    pending: { label: "Pending", action: "cancel", color: "bg-yellow-500 hover:bg-yellow-600" },
    incoming: { label: "Accept", action: "accept", color: "bg-blue-500 hover:bg-blue-600" },
    none: { label: "Add Friend", action: "request", color: "bg-green-500 hover:bg-green-600" },
  };

  const { label, action, color } = config[status] || config.none;

  return (
    <button
      onClick={() => onAction(action)}
      disabled={disabled}
      className={`${color} text-white px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

function ProfileModal({ contact, listings, onClose, onSelectListing }) {
  if (!contact) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="relative w-80 max-h-[80vh] overflow-y-auto rounded-3xl bg-[var(--color-surface)] 
                    shadow-[0_0_0_1px_rgba(37,99,235,0.25)] p-6 flex 
                    flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* x */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-lg text-[var(--color-text)] hover:opacity-70"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-sm font-semibold mb-6 text-[var(--color-text)]">Profile</h2>

        {/* avatar */}
        <div className="mb-4">
           <Avatar name={contact.name} image={contact.image} />
        </div>

        <p className="text-base font-semibold text-[var(--color-text)] mb-4">
          {contact.name}
        </p>

        {/* info */}
        <div className="space-y-4 text-sm w-full">
          <div>
            <p className="text-[var(--color-muted)]">Joined:</p>
            <p className="font-semibold text-[var(--color-secondary)]">
              {formatJoinedDate(contact.joinedAt)}
            </p>
          </div>

          {/* listings section*/}
          <div>
            <p className="text-[var(--color-muted)] mb-2">Listings ({listings?.length || 0}):</p>
            {listings && listings.length > 0 ? (
              <div className="space-y-2">
                {listings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => onSelectListing(listing)}
                    className="w-full p-3 bg-[var(--color-bg)] rounded-xl text-left 
                               hover:bg-[var(--color-primary)] hover:text-[var(--color-surface)]
                               transition-colors duration-200"
                  >
                    <p className="font-semibold text-sm">{listing.city}</p>
                    <p className="text-xs opacity-80">
                      {listing.roomType || listing.type || "Stay"} • {listing.availableSlots ?? listing.avSlots ?? 0} slots • {listing.pricePerNight ?? listing.price ?? "N/A"} MAD
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-muted)] text-xs">No listings available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingView({ listing, onBack }) {
  if (!listing) return null;

  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg)] p-6 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] 
                        shadow-[0_0_0_1px_rgba(37,99,235,0.25)] p-6 flex flex-col 
                        items-center text-center">
        
        {(listing.photoUrl || listing.photos?.[0]) && (
          <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
            <img 
              src={listing.photoUrl || listing.photos?.[0]} 
              alt={listing.city} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h2 className="text-lg font-semibold mb-2 text-[var(--color-text)]">
          {listing.city}
        </h2>
        
        <p className="text-sm text-[var(--color-muted)] mb-4">
          {listing.roomType || listing.type || "Stay"} • {listing.availableSlots ?? listing.avSlots ?? 0} slots available • {listing.pricePerNight ?? listing.price ?? "N/A"} MAD
        </p>

        {listing.description && (
          <p className="text-sm text-[var(--color-text)] mb-4 text-left w-full">
            {listing.description}
          </p>
        )}

        {listing.included && (
          <div className="w-full text-left mb-4">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-2">What's Included:</p>
            <ul className="text-xs text-[var(--color-muted)] space-y-1">
              {Array.isArray(listing.included) ? listing.included.map((item, idx) => (
                <li key={idx}>• {item}</li>
              )) : <li>• {listing.included}</li>}
            </ul>
          </div>
        )}

        {listing.expectations && (
          <div className="w-full text-left mb-4">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-2">House Rules:</p>
            <ul className="text-xs text-[var(--color-muted)] space-y-1">
              {Array.isArray(listing.expectations) ? listing.expectations.map((item, idx) => (
                <li key={idx}>• {item}</li>
              )) : <li>• {listing.expectations}</li>}
            </ul>
          </div>
        )}
        
        <button
          type="button"
          onClick={onBack}
          className="bg-[var(--color-primary)] text-[var(--color-surface)] 
                      px-4 py-2 rounded-lg text-sm hover:opacity-90 mt-2"
        >
          Back to chat
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { ownerId, stayId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = getStoredToken();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomSummaries, setRoomSummaries] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeContactStays, setActiveContactStays] = useState([]);
  const [myStays, setMyStays] = useState([]);
  const [contextStay, setContextStay] = useState(null);
  const [userProfilesById, setUserProfilesById] = useState({});
  const [friendStatusesByUser, setFriendStatusesByUser] = useState({});
  const [friendActionBusy, setFriendActionBusy] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState("chat");
  const [selectedListing, setSelectedListing] = useState(null);

  const stompClient = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const preserveOnEmptyOnceRef = useRef(false);

  useEffect(() => {
    if (location.state?.fromProfileChat) {
      preserveOnEmptyOnceRef.current = true;
    }
  }, [location.state]);

  const persistUnreadReset = async (roomId) => {
    if (!roomId || !token) return;
    try {
      await markRoomUnreadAsRead(roomId, token);
    } catch {
      // ignore transient backend errors; UI state is still cleared locally.
    }
  };

  const updateSummaryFromMessage = (message) => {
    if (!message?.roomId) return;

    const room = rooms.find((r) => r.id === message.roomId) || activeRoom;
    const isActiveRoom = activeRoom?.id === message.roomId;
    const isIncoming = message.senderId != null && message.senderId !== currentUser?.id;

    setRoomSummaries((prev) => {
      const existing = prev.find((s) => s.roomId === message.roomId);
      const unreadCount = isActiveRoom
        ? 0
        : Math.max(
            0,
            (existing?.unreadCount ?? 0) + (isIncoming ? 1 : 0),
          );

      const fallbackOtherUserId = room
        ? (room.user1Id === currentUser?.id ? room.user2Id : room.user1Id)
        : existing?.otherUserId;
      const fallbackOtherUsername = room
        ? (room.user1Id === currentUser?.id ? room.username2 : room.username1)
        : existing?.otherUsername;
      const fallbackAvatar = room
        ? (room.user1Id === currentUser?.id ? room.avatarUrl2 : room.avatarUrl1)
        : existing?.otherAvatarUrl;

      const updated = {
        roomId: message.roomId,
        otherUserId: existing?.otherUserId ?? fallbackOtherUserId ?? null,
        otherUsername: existing?.otherUsername ?? fallbackOtherUsername ?? "Unknown",
        otherAvatarUrl: existing?.otherAvatarUrl ?? fallbackAvatar ?? null,
        lastMessage: message.content || existing?.lastMessage || "",
        lastMessageAt: message.sentAt || new Date().toISOString(),
        unreadCount,
      };

      const rest = prev.filter((s) => s.roomId !== message.roomId);
      return [updated, ...rest];
    });
  };

  // Initialize: Current User & Rooms
  useEffect(() => {
    if (!token) {
      window.location.href = "/log-in";
      return;
    }

    async function init() {
      try {
        const user = await fetchMe(token);
        if (!user) {
           window.location.href = "/log-in";
           return;
        }
        setCurrentUser(user);
        
        const [allRooms, summaries] = await Promise.all([
          fetchRooms(token),
          fetchRoomSummaries(token).catch(() => []),
        ]);
        setRooms(allRooms);
        setRoomSummaries(Array.isArray(summaries) ? summaries : []);

        // If ownerId is provided, handle active room
        if (ownerId) {
          const ownerInt = parseInt(ownerId);
          // Guard against malformed ownerId (e.g. placeholder strings like 'owner-1')
          if (isNaN(ownerInt)) {
            // Redirect to chat list instead of attempting backend calls with invalid id
            window.location.href = "/chat";
            return;
          }

          let room = allRooms.find(r => 
            (r.user1Id === ownerInt || r.user2Id === ownerInt)
          );

          if (!room) {
            try {
              await ensureRoom(ownerInt, token);
              room = await fetchRoomBetween(ownerInt, token);
              setRooms(prev => [...prev, room]);
            } catch (err) {
              if (err.message.includes("401")) {
                 window.location.href = "/log-in";
                 return;
              }
              throw err;
            }
          }
          setActiveRoom(room);
        } else if (allRooms.length > 0) {
          setActiveRoom(allRooms[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [token, ownerId]);

  // Resolve stay context from route (`/chat/:ownerId/:stayId`) for both guest and owner views
  useEffect(() => {
    if (!stayId) {
      setContextStay(null);
      return;
    }

    const parsedStayId = Number(stayId);
    if (!Number.isFinite(parsedStayId)) {
      setContextStay(null);
      return;
    }

    let cancelled = false;

    async function resolveContextStay() {
      // First, try already loaded partner stays (fast path)
      const fromPartner = activeContactStays.find((s) => Number(s.id) === parsedStayId);
      if (fromPartner) {
        if (!cancelled) setContextStay(fromPartner);
        return;
      }

      // Then, try direct stay endpoint
      try {
        const stay = await fetchStayById(parsedStayId);
        if (stay) {
          if (!cancelled) setContextStay(stay);
          return;
        }
      } catch (err) {
        console.warn("Failed to load stay context directly", err);
      }

      // Owner fallback: fetch the current user's stays and match by stayId
      if (token && currentUser?.id != null) {
        try {
          const ownerStays = await fetchStaysByHostId(currentUser.id, token);
          const fromOwner = ownerStays.find((s) => Number(s.id) === parsedStayId) || null;
          if (!cancelled) setContextStay(fromOwner);
          return;
        } catch (err) {
          console.warn("Failed to load owner stay context", err);
        }
      }

      if (!cancelled) setContextStay(null);
    }

    resolveContextStay();

    return () => {
      cancelled = true;
    };
  }, [stayId, activeContactStays, currentUser?.id, token]);

  // Fetch messages and partner stays when active room changes
  useEffect(() => {
    if (!activeRoom || !token) return;

    async function loadData() {
      try {
        const [msgs, partnerStays] = await Promise.all([
          fetchMessages(activeRoom.id, token),
          fetchStaysByHostId(activeRoom.user1Id === currentUser?.id ? activeRoom.user2Id : activeRoom.user1Id, token)
        ]);
        setMessages((prev) => {
          const shouldPreserveCurrent =
            preserveOnEmptyOnceRef.current &&
            Array.isArray(msgs) &&
            msgs.length === 0 &&
            Array.isArray(prev) &&
            prev.length > 0;

          if (shouldPreserveCurrent) {
            preserveOnEmptyOnceRef.current = false;
            return prev;
          }

          preserveOnEmptyOnceRef.current = false;
          return msgs;
        });
        setActiveContactStays(partnerStays);
      } catch (err) {
        console.error("Failed to load room data", err);
      }
    }
    loadData();
  }, [activeRoom, token, currentUser?.id]);

  // Fetch current user's own stays (owner fallback for "View listings")
  useEffect(() => {
    if (!token || currentUser?.id == null) {
      setMyStays([]);
      return;
    }

    let cancelled = false;
    fetchStaysByHostId(currentUser.id, token)
      .then((stays) => {
        if (!cancelled) setMyStays(Array.isArray(stays) ? stays : []);
      })
      .catch(() => {
        if (!cancelled) setMyStays([]);
      });

    return () => {
      cancelled = true;
    };
  }, [token, currentUser?.id]);

  // WebSocket Integration & Pending Message Logic
  useEffect(() => {
    if (!token) return;

    const socketUrl = `${import.meta.env.VITE_API_BASE_URL || ""}/ws`;
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: async () => {
        console.log("Connected to WebSocket");
        const roomIds = Array.from(new Set(rooms.map((r) => r.id).filter(Boolean)));

        roomIds.forEach((roomId) => {
          client.subscribe(`/topic/room.${roomId}`, (message) => {
            const newMsg = JSON.parse(message.body);

            if (activeRoom?.id === roomId) {
              setMessages((prev) => {
                if (prev.find((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }

            updateSummaryFromMessage(newMsg);
          });
        });

        if (activeRoom) {
          // Check for pending message precisely after connection is ready
          const pending = sessionStorage.getItem("pendingChatMessage");
          if (pending) {
            try {
              const { ownerId: pendingOwnerId, message } = JSON.parse(pending);
              if (pendingOwnerId != null && pendingOwnerId.toString() === ownerId?.toString()) {
                let existingMessages = null;
                for (let attempt = 0; attempt < 2; attempt += 1) {
                  try {
                    const fetched = await fetchMessages(activeRoom.id, token);
                    if (Array.isArray(fetched)) {
                      existingMessages = fetched;
                    }
                    break;
                  } catch {
                    // retry once for transient timing/network issues
                  }
                }

                if (!Array.isArray(existingMessages)) {
                  // Keep pending payload for a future successful connect/check.
                  return;
                }

                const shouldSend = existingMessages.length === 0;

                if (shouldSend) {
                  client.publish({
                    destination: `/app/chat/${activeRoom.id}`,
                    body: JSON.stringify({ content: message }),
                  });
                }

                // Consume after a confirmed decision.
                sessionStorage.removeItem("pendingChatMessage");
              }
            } catch (e) {
              console.error("Error parsing pending message", e);
              sessionStorage.removeItem("pendingChatMessage");
            }
          }
        }
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers['message']);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, rooms, activeRoom?.id, ownerId, currentUser?.id]);

  // Polling Fallback for sidebar previews
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      try {
        const [freshRooms, freshSummaries] = await Promise.all([
          fetchRooms(token),
          fetchRoomSummaries(token).catch(() => []),
        ]);
        setRoomSummaries(Array.isArray(freshSummaries) ? freshSummaries : []);
        setRooms(prev => {
          return freshRooms.map(fr => {
            const old = prev.find(p => p.id === fr.id);
            return old ? { ...old, ...fr } : fr;
          });
        });
      } catch (e) {
        console.warn("Polling fallback failed", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [messages, activeRoom]);

  // UI Mapping
  const contacts = useMemo(() => {
    if (roomSummaries.length > 0) {
      return roomSummaries.map((summary) => {
        const statusMeta = friendStatusesByUser[summary.otherUserId] || { status: "none", requestId: null };
        return {
        id: summary.otherUserId,
        roomId: summary.roomId,
        name: summary.otherUsername,
        image: summary.otherAvatarUrl || null,
        online: false,
        preview: summary.lastMessage || "Start chatting...",
        unread: Number(summary.unreadCount || 0),
        friendStatus: statusMeta.status || "none",
        friendRequestId: statusMeta.requestId ?? null,
      };
      });
    }

    return rooms.map(room => {
      const isUser1 = room.user1Id === currentUser?.id;
      const otherUsername = isUser1 ? room.username2 : room.username1;
      const otherId = isUser1 ? room.user2Id : room.user1Id;
      const otherAvatar = isUser1
        ? (room.avatarUrl2 || room.user2AvatarUrl || room.otherAvatarUrl || null)
        : (room.avatarUrl1 || room.user1AvatarUrl || room.otherAvatarUrl || null);
      const statusMeta = friendStatusesByUser[otherId] || { status: "none", requestId: null };
      
      return {
        id: otherId,
        roomId: room.id,
        name: otherUsername,
        image: otherAvatar,
        online: false,
        preview: "Start chatting...",
        unread: 0,
        friendStatus: statusMeta.status || "none",
        friendRequestId: statusMeta.requestId ?? null,
      };
    });
  }, [roomSummaries, rooms, currentUser, friendStatusesByUser]);

  const contactUserIds = useMemo(() => {
    if (roomSummaries.length > 0) {
      return Array.from(new Set(
        roomSummaries
          .map((s) => s.otherUserId)
          .filter((id) => id != null)
      ));
    }

    return Array.from(new Set(
      rooms
        .map((room) => (room.user1Id === currentUser?.id ? room.user2Id : room.user1Id))
        .filter((id) => id != null)
    ));
  }, [roomSummaries, rooms, currentUser?.id]);

  useEffect(() => {
    if (!token || contactUserIds.length === 0) {
      setFriendStatusesByUser({});
      return;
    }

    let cancelled = false;

    fetchFriendStatuses(contactUserIds, token)
      .then((rows) => {
        if (cancelled) return;
        const next = {};
        (Array.isArray(rows) ? rows : []).forEach((row) => {
          if (row?.userId == null) return;
          next[row.userId] = {
            status: row.status || "none",
            requestId: row.requestId ?? null,
          };
        });
        setFriendStatusesByUser(next);
      })
      .catch((err) => {
        console.warn("Failed to load friend statuses", err);
      });

    return () => {
      cancelled = true;
    };
  }, [token, contactUserIds]);

  // Fetch chat contact profiles to get reliable avatar/joined date metadata
  useEffect(() => {
    if (!token || contacts.length === 0) return;

    const missingIds = contacts
      .map((c) => c.id)
      .filter((id) => id != null && !userProfilesById[id]);

    if (missingIds.length === 0) return;

    let cancelled = false;

    Promise.all(
      missingIds.map(async (id) => {
        try {
          const res = await fetch(`/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) return null;
          const data = await res.json();
          return { id, data };
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      setUserProfilesById((prev) => {
        const next = { ...prev };
        results.forEach((entry) => {
          if (entry?.data) next[entry.id] = entry.data;
        });
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [token, contacts, userProfilesById]);

  const activeContact = useMemo(() => {
    if (!activeRoom) return contacts[0];
    const contact = contacts.find(c => c.roomId === activeRoom.id);
    if (!contact) return contact;

    const profile = userProfilesById[contact.id] || null;

    const firstStayOwnedByContact =
      activeContactStays.find((s) => Number(s.owner?.id ?? s.hostId) === Number(contact.id)) || null;

    return {
      ...contact,
      // Avatar: prefer room payload, then verified contact-owned stay/context.
      image:
        contact.image ||
        profile?.avatarUrl ||
        (contextStay?.owner?.id != null && Number(contextStay.owner.id) === Number(contact.id)
          ? (contextStay.owner?.image || contextStay.hostAvatarUrl)
          : null) ||
        firstStayOwnedByContact?.owner?.image ||
        firstStayOwnedByContact?.hostAvatarUrl ||
        null,
      joinedAt: profile?.createdAt || null,
    };
  }, [activeRoom, contacts, activeContactStays, contextStay, userProfilesById]);

  const chatMessages = messages.map(m => ({
    id: m.id,
    text: m.content,
    from: m.senderId === currentUser?.id ? "me" : "them"
  }));

  function selectContact(roomId) {
    const room = rooms.find(r => r.id === roomId);
    setActiveRoom(room);
    setView("chat");
    setSelectedListing(null);
    setRoomSummaries((prev) =>
      prev.map((s) => (s.roomId === roomId ? { ...s, unreadCount: 0 } : s)),
    );

    void persistUnreadReset(roomId);
  }

  useEffect(() => {
    if (!activeRoom?.id) return;
    setRoomSummaries((prev) =>
      prev.map((s) => (s.roomId === activeRoom.id ? { ...s, unreadCount: 0 } : s)),
    );

    void persistUnreadReset(activeRoom.id);
  }, [activeRoom?.id]);

  function sendMessage() {
    const text = input.trim();
    if (!text || !activeRoom || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: `/app/chat/${activeRoom.id}`,
      body: JSON.stringify({ content: text }),
    });

    setInput("");
  }

  async function handleFriendAction(action) {
    if (!activeContact?.id || !token || friendActionBusy) return;

    const requestId = activeContact.friendRequestId;
    setFriendActionBusy(true);
    try {
      let response = null;
      if (action === "request") {
        response = await sendFriendRequest(activeContact.id, token);
      } else if (action === "accept") {
        if (!requestId) return;
        response = await acceptFriendRequest(requestId, token);
      } else if (action === "cancel") {
        if (!requestId) return;
        response = await deleteFriendRequest(requestId, token);
      } else if (action === "unfriend") {
        response = await unfriendUser(activeContact.id, token);
      }

      if (response?.userId != null) {
        setFriendStatusesByUser((prev) => ({
          ...prev,
          [response.userId]: {
            status: response.status || "none",
            requestId: response.requestId ?? null,
          },
        }));
      }
    } catch (err) {
      console.error("Friend action failed", err);
    } finally {
      setFriendActionBusy(false);
    }
  }

  async function handleClickHere() {
    // If we have a stayId in URL, use it
    if (stayId) {
       const parsedOwnerId = Number(ownerId);
       const isOwnerViewer = Number.isFinite(parsedOwnerId) && Number(currentUser?.id) === parsedOwnerId;

       // Owner flow: redirect to the stay page.
       if (isOwnerViewer) {
        navigate(`/slot-show/${stayId}`);
        return;
       }

       let found = activeContactStays.find(s => s.id.toString() === stayId) ||
         (contextStay && contextStay.id?.toString() === stayId ? contextStay : null);

       if (!found) {
        const parsedStayId = Number(stayId);
        if (Number.isFinite(parsedStayId)) {
          try {
            found = await fetchStayById(parsedStayId);
            if (found) setContextStay(found);
          } catch {
            // ignore and fallback below
          }
        }
       }

       if (found) {
         setSelectedListing(found);
         setView("listing");
         return;
       }

       // fallback if listing context is unavailable
       navigate(`/slot-show/${stayId}`);
       return;
    }
    
    // Fallback to first available stay context
    if (activeContactStays.length > 0) {
      setSelectedListing(activeContactStays[0]);
      setView("listing");
    } else if (myStays.length > 0) {
      // Owner chatting with requester (who may have no listings): show owner's listings.
      setSelectedListing(myStays[0]);
      setView("listing");
    } else if (contextStay) {
      setSelectedListing(contextStay);
      setView("listing");
    } else {
      setSelectedListing(null);
      setView("chat");
    }
  }

  function handleSelectListingFromProfile(listing) {
    setShowProfile(false);
    setSelectedListing(listing);
    setView("listing");
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-[var(--color-bg)]">Loading chat...</div>;
  if (error) return <div className="h-screen flex items-center justify-center bg-[var(--color-bg)] text-red-500">{error}</div>;
  if (!activeContact && !ownerId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)] text-[var(--color-muted)] px-4 text-center">
        <p>No active chats. Start one from a listing!</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-lg border border-[var(--color-border-gray)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors text-sm"
          >
            ← Back
          </button>
          <Link
            to="/slots"
            className="px-3 py-2 rounded-lg bg-[var(--color-secondary)] text-white hover:opacity-90 transition-opacity text-sm"
          >
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-w-7xl mx-auto p-4 flex flex-col bg-[var(--color-bg)] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-lg border border-[var(--color-border-gray)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors text-sm"
        >
          ← Back
        </button>
        <Link to="/"> 
          <Return className="cursor-pointer" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row bg-[var(--color-surface)] 
                        rounded-2xl shadow-xl overflow-hidden">

        {/* friends list */}
        <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r 
                          border-[var(--color-border-gray)] flex flex-col">
          <h2 className="text-lg font-bold p-4 border-b 
                          text-[var(--color-text)]">People</h2>

          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button
                key={c.roomId}
                onClick={() => selectContact(c.roomId)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--color-bg)] transition
                  ${c.roomId === activeRoom?.id ? "bg-[var(--color-bg)] border-l-4 border-[var(--color-secondary)]" : ""}`}
              >
                <Avatar name={c.name} image={c.image} />
                <div className="flex-1 min-w-0">
                  <span className="block font-semibold text-sm text-[var(--color-text)]">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="block text-xs text-[var(--color-muted)] truncate">{c.preview}</span>
                    {c.unread > 0 ? (
                      <span className="min-w-5 h-5 px-1 rounded-full bg-[var(--color-secondary)] text-white text-[10px] font-semibold flex items-center justify-center">
                        {c.unread > 99 ? "99+" : c.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* the chat */}
        <main className="flex-1 flex flex-col">
          {activeContact && (
            <header className="flex justify-between items-center p-5 border-b border-[var(--color-border-gray)]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfile(true)}
                  className="rounded-full focus:outline-none"
                  aria-label="Open profile"
                >
                  <Avatar name={activeContact.name} image={activeContact.image} />
                </button>
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{activeContact.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {stayId ? `Chat about listing ` : `Chat about: `}
                    <button
                      type="button"
                      onClick={handleClickHere}
                      className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-secondary)]"
                    >
                      Click here
                    </button>
                  </p>
                </div>
              </div>
              <FriendButton
                status={activeContact.friendStatus}
                onAction={handleFriendAction}
                disabled={friendActionBusy}
              />
            </header>
          )}

          {view === "chat" ? (
            <>
              {/* messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--color-bg)]">
                {chatMessages.length === 0 ? (
                  <p className="h-full flex items-center justify-center text-sm text-[var(--color-muted)]">
                    {activeContact ? "No messages yet... send a request or a hello!" : "Select a contact to start chatting"}
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] sm:max-w-[70%] break-words break-all whitespace-pre-wrap
                          ${msg.from === "me"
                            ? "bg-[var(--color-primary)] text-[var(--color-surface)] rounded-br-md"
                            : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-gray)] rounded-bl-md"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              {/* input field */}
              {activeRoom && (
                <div className="p-4 border-t border-[var(--color-border-gray)] bg-[var(--color-surface)]">
                  <div className="flex items-center gap-3 bg-[var(--color-bg)] rounded-xl px-4 py-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text)]"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-[var(--color-primary)] hover:opacity-90 
                                text-[var(--color-surface)] px-4 py-2 rounded-lg text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ListingView listing={selectedListing} onBack={() => setView("chat")} />
          )}
        </main>
      </div>

      {showProfile && activeContact && (
        <ProfileModal 
          contact={activeContact} 
          listings={activeContactStays}
          onClose={() => setShowProfile(false)} 
          onSelectListing={handleSelectListingFromProfile}
        />
      )}
    </div>
  );
}
