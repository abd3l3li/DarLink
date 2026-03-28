# Notifications — Expected Endpoints

The frontend has a notification dropdown/bell and a notification context.

Backend already provides a notifications system (REST + WebSocket). This doc describes the expected contract and how it maps to the UI.

---

## Notification object (backend shape)

Backend notifications (from backend docs) look like:

```json
{
  "id": 1,
  "type": "new_message",
  "senderUsername": "ali",
  "roomId": 1,
  "message": "ali sent you a message",
  "link": "/chat/1",
  "read": false,
  "createdAt": "2026-01-01T00:00:00"
}
```

## Notification object (frontend UI expectation)

Your UI context expects:

```json
{
  "id": 1,
  "type": "message",
  "message": "ali sent you a message",
  "link": "/chat/1",
  "read": false,
  "timestamp": "2026-01-01T00:00:00Z"
}
```

Recommended mapping:

- `timestamp = createdAt`
- Map backend types into UI types:
  - `new_message` → `message`
  - `room_updated` → `welcome` or `profile_update` (or add a UI type)

---

## List notifications

### GET `/api/notifications` (protected)

Returns all notifications for the authenticated user, newest first.

**Response `200`**
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
  }
]
```

---

## Unread count

### GET `/api/notifications/unread-count` (protected)

**Response `200`**
```json
{ "count": 3 }
```

---

## Mark all as read

### POST `/api/notifications/read` (protected)

**Response `200`**
```json
"All notifications marked as read"
```

---

## Recommended additions

### POST `/api/notifications/{id}/read` (protected)

Mark a single notification as read.

### DELETE `/api/notifications/{id}` (protected)

Delete a notification.

---

## Real-time notifications (WebSocket)

Backend pushes notifications via WebSocket after login.

- Subscribe topic (one of these depending on backend config):
  - `/topic/user.{email}` (common pattern in current backend docs)
  - or `/topic/user.{userId}`

**What you receive**

```json
{ "type": "new_message", "roomId": 1, "senderUsername": "ali" }
```

Suggested UI behavior:

- Increment badge count
- If dropdown is open, refresh `GET /api/notifications`
