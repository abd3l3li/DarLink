# DarLink — Notifications API

> ⚠️ **Under Testing** — These endpoints are functional but still being tested. The notification types and content may change based on frontend requirements. If you have any questions or need changes contact the backend team.

This document covers the notification system. Notifications are stored in the database and also delivered in real time via WebSocket.

---

## Base URL

```
https://localhost:1337
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
GET https://localhost:1337/api/notifications
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
GET https://localhost:1337/api/notifications/unread-count
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
POST https://localhost:1337/api/notifications/read
Authorization: Bearer {token}
```

Response: `200 OK`
```
"All notifications marked as read"
```

---

### POST /api/notifications/read.{id}

Marks a specific notification as read.

```
POST https://localhost:1337/api/notifications/read.{id}
Authorization: Bearer {token}
```

Response: `200 OK`
```
"Notification marked as read"
```

---

## Real Time Notifications via WebSocket

In addition to fetching notifications via REST, the server pushes notifications in real time via WebSocket. Subscribe to the personal topic after login to receive them instantly.

### Subscribe To Personal Topic

```javascript
// decode email from JWT token
const payload = JSON.parse(atob(token.split('.')[1]));
const email = payload.sub;

// subscribe to personal topic
stompClient.subscribe(`/topic/user.${email}`, (frame) => {
  const notification = JSON.parse(frame.body);
  console.log(notification.type);           // "new_message" or "room_updated"
  console.log(notification.senderUsername); // who triggered it
  console.log(notification.roomId);         // which room (null for room_updated)
});
```

> Subscribe once after WebSocket connection is established on login. Do not resubscribe on every page change.

### What You Receive

```json
{ "type": "new_message",  "roomId": 1,    "senderUsername": "ali" }
{ "type": "room_updated", "roomId": null, "senderUsername": "ali" }
```

### Suggested Behaviour

```
On new_message  → increment notification badge count
                → if notification panel is open, refresh GET /api/notifications

On room_updated → refresh rooms list
                → increment notification badge count
```

---



## Notification Types

| Type | When | `message` example | `link` |
|------|------|-------------------|--------|
| `new_message` | Someone sent you a message | "ali sent you a message" | `/chat/{roomId}` |
| `room_updated` | Someone created a room with you | "ali created a room with you" | `/chat` |

> 📝 **Note** — More notification types will be added based on frontend requirements. If you need a new notification type or have any questions contact the backend team.

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
