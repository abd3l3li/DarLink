# Chat + Friends — Expected Endpoints

This doc covers:

- Chat UI (`/chat/:ownerId` and `/chat/:ownerId/:stayId`)
- Contact list / preview message
- (Optional) friend request actions shown in the UI mock

---

## Chat (backend-supported)

### Create or ensure a room exists

#### POST `/api/rooms?user2Id={id}` (protected)

Creates a chat room between the logged-in user and `user2Id`.

**Response `200`**
```json
"Chat room created successfully"
```

#### GET `/api/rooms/between?user2Id={id}` (protected)

Fetch room metadata.

**Response `200`**
```json
{
  "id": 3,
  "createdAt": "2026-03-28T10:00:00Z",
  "user1Id": 1,
  "username1": "john_doe",
  "user2Id": 7,
  "username2": "jane_doe"
}
```

### List my rooms

#### GET `/api/rooms` (protected)

**Response `200`**
```json
[
  {
    "id": 3,
    "createdAt": "2026-03-28T10:00:00Z",
    "user1Id": 1,
    "username1": "john_doe",
    "user2Id": 7,
    "username2": "jane_doe"
  }
]
```

### Get messages for a room

#### GET `/api/rooms/messages?roomId={id}` (protected)

**Response `200`**
```json
[
  {
    "id": 1,
    "content": "Hello!",
    "sentAt": "2026-03-28T10:05:00Z",
    "senderId": 1,
    "senderUsername": "john_doe",
    "roomId": 3
  }
]
```

---

## WebSocket chat (backend-supported)

### Connect

- WebSocket endpoint: `/ws`

### Send message

- Send destination: `/app/chat/{roomId}`

Payload:
```json
{ "content": "Salam, is this room still available?" }
```

### Subscribe

- Messages: `/topic/room.{roomId}`
- Notifications: `/topic/user.{userId}` (or email-based topic depending on backend config)

---

## Mapping backend messages → UI mock messages

UI mock currently uses:

```json
{ "id": 1, "text": "Hey", "from": "me" }
```

Recommended mapping:

- `text = content`
- `from = (senderId === me.id) ? "me" : "them"`

---

## Friend requests (backend-supported)

The chat UI now supports button states:

- `friend` → show Delete
- `pending` → show Pending
- `incoming` → show Accept
- `none` → show Add Friend

Implemented endpoints:

### GET `/api/friends/statuses?userIds=7,9,12` (protected)

Returns friend state for each provided user:

```json
[
  { "userId": 7, "status": "friend", "requestId": 14 },
  { "userId": 9, "status": "pending", "requestId": 15 },
  { "userId": 12, "status": "incoming", "requestId": 16 }
]
```

### POST `/api/friend-requests` (protected)

**Request**

```json
{ "userId": 7 }
```

### POST `/api/friend-requests/{id}/accept` (protected)

Accept incoming request.

### DELETE `/api/friend-requests/{id}` (protected)

Cancel outgoing pending request (or reject incoming pending request).

### DELETE `/api/friends/{userId}` (protected)

Removes an existing friendship.

---

## Contact list enrichment (recommended)

To build the left “People” list like the mock (preview, unread, online), it helps to have:

### GET `/api/rooms/summaries` (protected)

**Response `200`**
```json
[
  {
    "roomId": 3,
    "otherUserId": 7,
    "otherUsername": "jane_doe",
    "otherAvatarUrl": "https://...",
    "lastMessage": "Looking forward to hearing from you!",
    "lastMessageAt": "2026-03-28T10:06:00Z",
    "unreadCount": 2,
    "otherOnline": false
  }
]
```
