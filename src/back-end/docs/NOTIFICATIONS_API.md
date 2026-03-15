# DarLink — Notifications API

> ⚠️ **Under Testing** — These endpoints are functional but still being tested. The notification types and content may change based on frontend requirements.

This document covers the notification system. Notifications are stored in the database and also delivered in real time via WebSocket.

---

## Base URL

```
https://localhost:8443
```

---

## How Notifications Work

```
Something happens (new message, new room, etc.)
→ server saves notification to DB
→ server sends it via WebSocket to /topic/user.{email}

User opens notification panel
→ frontend calls GET /api/notifications
→ displays all notifications

User closes notification panel
→ frontend calls POST /api/notifications/read
→ marks all as read
→ badge count resets to 0
```

---

## REST Endpoints

### GET /api/notifications

Returns all notifications for the authenticated user, newest first.

```
GET https://localhost:8443/api/notifications
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "id": 1,
    "type": "new_message",
    "senderUsername": "ali",
    "roomId": 1,
    "message": "ali sent you a message",
    "link": "/chat/1",
    "read": false,
    "createdAt": "2026-01-01T00:00:00"
  },
  {
    "id": 2,
    "type": "room_updated",
    "senderUsername": "sara",
    "roomId": null,
    "message": "sara created a room with you",
    "link": "/chat",
    "read": true,
    "createdAt": "2026-01-01T00:00:00"
  }
]
```

---

### GET /api/notifications/unread-count

Returns the count of unread notifications. Use this for the notification badge.

```
GET https://localhost:8443/api/notifications/unread-count
Authorization: Bearer {token}
```

Response:
```json
{ "count": 3 }
```

---

### POST /api/notifications/read

Marks all notifications as read. Call this when the user opens the notification panel.

```
POST https://localhost:8443/api/notifications/read
Authorization: Bearer {token}
```

Response: `200 OK`
```
"All notifications marked as read"
```

---

## Notification Types

| Type | When | `message` example | `link` |
|------|------|-------------------|--------|
| `new_message` | Someone sent you a message | "ali sent you a message" | `/chat/{roomId}` |
| `room_updated` | Someone created a room with you | "ali created a room with you" | `/chat` |

---

## Database Schema

```
notifications
-------------
id               (PK)
type
sender_username
room_id
message
link
read
created_at
user_id          (FK → users)
```
