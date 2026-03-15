# DarLink — Chat System API

This document covers the chat rooms and real-time messaging system.
All requests must include a valid JWT token in the Authorization header.

---

## Base URLs

| Protocol | URL |
|----------|-----|
| HTTPS | `https://localhost:8443` |
| WebSocket | `https://localhost:8443/ws` |

> HTTP requests to `http://localhost:8080` are automatically redirected to HTTPS.

---

## Authentication

Every request must include the JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

Without a token the server returns:
```json
{ "error": "Unauthorized" }
```

---

## REST Endpoints

### POST /api/rooms

Creates a new chat room between the authenticated user and another user.
If the room already exists throws an error.
Sends a `room_updated` notification to both users.

```
POST https://localhost:8443/api/rooms?user2Id={id}
Authorization: Bearer {token}
```

Response: `200 OK`
```
"Chat room created successfully"
```

---

### GET /api/rooms

Returns all chat rooms the authenticated user belongs to.

```
GET https://localhost:8443/api/rooms
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "id": 1,
    "createdAt": "2026-01-01T00:00:00",
    "user1Id": 1,
    "username1": "ali",
    "user2Id": 2,
    "username2": "sara"
  }
]
```

---

### GET /api/rooms/between

Returns the chat room between the authenticated user and another user.
Checks both directions automatically.

```
GET https://localhost:8443/api/rooms/between?user2Id={id}
Authorization: Bearer {token}
```

Response:
```json
{
  "id": 1,
  "createdAt": "2026-01-01T00:00:00",
  "user1Id": 1,
  "username1": "ali",
  "user2Id": 2,
  "username2": "sara"
}
```

---

### GET /api/rooms/messages

Returns the full message history for a room.

```
GET https://localhost:8443/api/rooms/messages?roomId={id}
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "id": 1,
    "content": "hello",
    "sentAt": "2026-01-01T00:00:00",
    "senderId": 1,
    "senderUsername": "ali",
    "roomId": 1
  }
]
```

---

## WebSocket / STOMP

### Connect

Connect using SockJS + STOMP client:

```javascript
const socket = new SockJS('https://localhost:8443/ws');
const stompClient = Stomp.over(socket);

stompClient.connect(
  { Authorization: 'Bearer ' + token },
  () => { console.log('connected') }
);
```

> The JWT token must be sent in the STOMP CONNECT headers.
> All client → server messages use prefix `/app`
> All server → client messages use prefix `/topic`

---

### SEND — Send a Message

```javascript
stompClient.send(
  '/app/chat/{roomId}',
  {},
  JSON.stringify({ roomId: 1, content: 'hello' })
);
```

Payload:
```json
{
  "roomId": 1,
  "content": "hello"
}
```

> No need to send `senderId` — the server reads it from the JWT token.

---

### SUBSCRIBE — Room Messages

```javascript
stompClient.subscribe('/topic/room.{roomId}', (frame) => {
  const msg = JSON.parse(frame.body);
  console.log(msg.senderUsername, msg.content);
});
```

Receives:
```json
{
  "id": 1,
  "content": "hello",
  "sentAt": "2026-01-01T00:00:00",
  "senderId": 1,
  "senderUsername": "ali",
  "roomId": 1
}
```

---

### SUBSCRIBE — Personal Notifications

Subscribe after login to receive real time notifications.

```javascript
const payload = JSON.parse(atob(token.split('.')[1]));
const email = payload.sub;

stompClient.subscribe(`/topic/user.${email}`, (frame) => {
  const notification = JSON.parse(frame.body);

  if (notification.type === 'room_updated') {
    // refresh rooms list
  } else if (notification.type === 'new_message') {
    // show notification popup
  }
});
```

Receives:
```json
{ "type": "room_updated", "roomId": null, "senderUsername": "ali" }
{ "type": "new_message",  "roomId": 1,    "senderUsername": "ali" }
```

| Type | `roomId` | When | Suggested Action |
|------|----------|------|-----------------|
| `room_updated` | `null` | Someone created a room with you | Refresh rooms list |
| `new_message` | room id | Someone sent you a message | Show notification popup |

---

## Database Schema

```
chat_rooms
----------
id          (PK)
created_at
user1_id    (FK → users)
user2_id    (FK → users)

messages
--------
id          (PK)
content
sent_at
sender_id   (FK → users)
room_id     (FK → chat_rooms)
```
