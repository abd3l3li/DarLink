# DarLink — API Reference for Frontend

> **Base URL:** `http://localhost:8081`
> All dates are ISO-8601 format. All request/response bodies are JSON.

---

## Authentication

Most endpoints require a JWT token.
After login or register, you get a `token` back.
Send it in **every protected request** as a header:

```
Authorization: Bearer <your_token_here>
```

Endpoints marked 🔓 are **public** (no token needed).
Endpoints marked 🔒 are **protected** (token required).

---

## 1. Auth — `/api/auth`

### 🔓 POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

| Field | Type | Rules |
|---|---|---|
| `username` | string | required, 3–20 characters |
| `email` | string | required, valid email format |
| `password` | string | required, min 6 characters |

**Success Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error `400`** — validation failed (e.g. email already in use)

---

### 🔓 POST `/api/auth/login`
Login with existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error `401`** — wrong email or password

---

## 2. User Profile — `/api/users`

### 🔒 GET `/api/users/me`
Get the logged-in user's profile.

**Headers:** `Authorization: Bearer <token>`

**Success Response `200`:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "bio": "Hi, I love travelling!",
  "city": "Casablanca",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2025-01-10T14:30:00"
}
```

---

### 🔒 PATCH `/api/users/me`
Update the logged-in user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body** (all fields are optional):
```json
{
  "bio": "Updated bio here",
  "city": "Rabat",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

| Field | Type | Rules |
|---|---|---|
| `bio` | string | optional, max 500 chars |
| `city` | string | optional, max 100 chars |
| `avatarUrl` | string | optional, max 1000 chars |

**Success Response `200`:** same shape as `GET /api/users/me`

---

## 3. Stays (Listings) — `/api/stays`

### 🔓 GET `/api/stays`
Get all stays. Optionally filter by city or max price.

**Query Params (optional):**

| Param | Type | Example |
|---|---|---|
| `city` | string | `?city=Casablanca` |
| `maxPrice` | number | `?maxPrice=200` |

**Success Response `200`:** Array of stay objects
```json
[
  {
    "id": 1,
    "name": "Cozy Room in Casablanca",
    "description": "Nice and clean room near the center.",
    "city": "Casablanca",
    "address": "12 Rue Hassan II",
    "pricePerNight": 150.0,
    "photoUrl": "https://example.com/photo.jpg",
    "hostId": 3,
    "hostUsername": "host_user",
    "createdAt": "2025-02-01T10:00:00"
  }
]
```

---

### 🔓 GET `/api/stays/page?page=0`
Get stays paginated — **9 stays per page**.

**Query Params:**

| Param | Type | Default | Example |
|---|---|---|---|
| `page` | number | `0` | `?page=0` (first page), `?page=1` (second page) |

**Success Response `200`:**
```json
{
  "content": [ ...9 stay objects... ],
  "totalPages": 5,
  "totalElements": 43,
  "number": 0,
  "size": 9,
  "first": true,
  "last": false
}
```

> Use `first` / `last` booleans to disable Prev/Next buttons on the UI.

---

### 🔓 GET `/api/stays/{id}`
Get a single stay by ID.

**Success Response `200`:** Single stay object (same shape as above)

**Error `404`** — stay not found

---

### 🔒 POST `/api/stays/create`
Create a new stay listing. You must be logged in (you become the host).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Cozy Room in Casablanca",
  "description": "Nice and clean room near the center.",
  "city": "Casablanca",
  "address": "12 Rue Hassan II",
  "pricePerNight": 150.0,
  "photoUrl": "https://example.com/photo.jpg"
}
```

| Field | Type | Rules |
|---|---|---|
| `name` | string | required, max 100 chars |
| `description` | string | optional, max 2000 chars |
| `city` | string | required, max 100 chars |
| `address` | string | optional, max 255 chars |
| `pricePerNight` | number | optional, min 0 |
| `photoUrl` | string | optional, max 1000 chars |

**Success Response `200`:** The created stay object

---

### 🔒 PUT `/api/stays/{id}`
Update an existing stay. **Only the host who created it can update.**

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as `POST /api/stays/create`

**Success Response `200`:** The updated stay object

**Error `403`** — you are not the host of this stay

---

### 🔒 DELETE `/api/stays/{id}`
Delete a stay. **Only the host who created it can delete.**

**Headers:** `Authorization: Bearer <token>`

**Success Response `204`** — no body

**Error `403`** — you are not the host of this stay

---

## 4. Booking Requests (Slot Requests) — `/api/slot-requests`

### 🔒 POST `/api/slot-requests`
Guest sends a booking request for a stay.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "stayId": 1,
  "startDate": "2025-06-01",
  "endDate": "2025-06-07"
}
```

| Field | Type | Rules |
|---|---|---|
| `stayId` | number | required |
| `startDate` | date string `YYYY-MM-DD` | required, must be in the future |
| `endDate` | date string `YYYY-MM-DD` | required, must be in the future |

**Success Response `200`:**
```json
{
  "id": 10,
  "stayId": 1,
  "stayName": "Cozy Room in Casablanca",
  "guestId": 5,
  "guestUsername": "john_doe",
  "startDate": "2025-06-01",
  "endDate": "2025-06-07",
  "status": "PENDING",
  "createdAt": "2025-05-01T09:00:00"
}
```

---

### 🔒 GET `/api/slot-requests/me`
Guest views all their own booking requests.

**Headers:** `Authorization: Bearer <token>`

**Success Response `200`:** Array of slot request objects (same shape as above)

---

### 🔒 GET `/api/slot-requests/host`
Host views all booking requests on their stays.

**Headers:** `Authorization: Bearer <token>`

**Success Response `200`:** Array of slot request objects

---

### 🔒 PATCH `/api/slot-requests/{id}/status`
Host accepts or rejects a booking request. **Only the host can do this.**

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "ACCEPTED"
}
```

| Value | Meaning |
|---|---|
| `ACCEPTED` | Host approves the booking |
| `REJECTED` | Host declines the booking |
| `CANCELLED` | Cancel the request |

**Success Response `200`:** The updated slot request object

---

## 5. Chat — REST + WebSocket

### 5a. REST Endpoints (require 🔒 JWT token)

#### 🔒 POST `/api/rooms?user2Id={id}`
Create a chat room between you and another user.

**Headers:** `Authorization: Bearer <token>`

**Query Param:**

| Param | Type | Example |
|---|---|---|
| `user2Id` | number | `?user2Id=7` |

**Success Response `200`:** `"Chat room created successfully"`

---

#### 🔒 GET `/api/rooms/between?user2Id={id}`
Get the chat room info between you and another user.

**Headers:** `Authorization: Bearer <token>`

**Success Response `200`:**
```json
{
  "id": 3,
  "createdAt": "2025-03-01T12:00:00",
  "user1Id": 1,
  "username1": "john_doe",
  "user2Id": 7,
  "username2": "jane_doe"
}
```

---

#### 🔒 GET `/api/rooms/messages?roomId={id}`
Get all messages in a chat room.

**Headers:** `Authorization: Bearer <token>`

**Success Response `200`:** Array of messages
```json
[
  {
    "id": 1,
    "content": "Hello!",
    "sentAt": "2025-03-01T12:05:00",
    "senderId": 1,
    "senderUsername": "john_doe",
    "roomId": 3
  }
]
```

---

#### 🔒 GET `/api/rooms`
Get all chat rooms the logged-in user is part of.

**Headers:** `Authorization: Bearer <token>`

**Success Response `200`:** Array of chat room objects (same shape as `/api/rooms/between`)

---

### 5b. WebSocket — Real-time Messaging

**Step 1 — Connect**

Connect to the WebSocket endpoint using SockJS + STOMP:

```js
const socket = new SockJS("http://localhost:8081/ws");
const stompClient = Stomp.over(socket);

stompClient.connect(
  { Authorization: "Bearer <your_token>" },  // send JWT here
  () => {
    console.log("Connected!");
  }
);
```

---

**Step 2 — Subscribe to a room (receive messages)**

```js
stompClient.subscribe("/topic/room.{roomId}", (message) => {
  const msg = JSON.parse(message.body);
  // msg shape: { id, content, sentAt, senderId, senderUsername, roomId }
  console.log("New message:", msg);
});
```

Replace `{roomId}` with the actual room ID number, e.g. `/topic/room.3`

---

**Step 3 — Subscribe to user notifications**

```js
stompClient.subscribe("/topic/user.{userId}", (notif) => {
  const data = JSON.parse(notif.body);
  // data shape: { type, roomId, senderUsername }
  // type values: "new_message" | "room_updated"
  console.log("Notification:", data);
});
```

Replace `{userId}` with the logged-in user's ID.

---

**Step 4 — Send a message**

```js
stompClient.send(
  "/app/chat/{roomId}",   // replace {roomId} with actual ID
  {},
  JSON.stringify({ content: "Hello!" })
);
```

> ⚠️ Do NOT put `senderId` in the payload. The server always takes the sender identity from your JWT token automatically.

---

## Quick Reference Table

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | 🔓 | Register |
| POST | `/api/auth/login` | 🔓 | Login |
| GET | `/api/users/me` | 🔒 | Get my profile |
| PATCH | `/api/users/me` | 🔒 | Update my profile |
| GET | `/api/stays` | 🔓 | List all stays |
| GET | `/api/stays/page?page=0` | 🔓 | Paginated stays (9/page) |
| GET | `/api/stays/{id}` | 🔓 | Get one stay |
| POST | `/api/stays/create` | 🔒 | Create stay |
| PUT | `/api/stays/{id}` | 🔒 | Update stay (host only) |
| DELETE | `/api/stays/{id}` | 🔒 | Delete stay (host only) |
| POST | `/api/slot-requests` | 🔒 | Book a stay |
| GET | `/api/slot-requests/me` | 🔒 | My booking requests |
| GET | `/api/slot-requests/host` | 🔒 | Requests on my stays |
| PATCH | `/api/slot-requests/{id}/status` | 🔒 | Accept/Reject booking |
| POST | `/api/rooms?user2Id=` | 🔒 | Create chat room |
| GET | `/api/rooms/between?user2Id=` | 🔒 | Get room between two users |
| GET | `/api/rooms/messages?roomId=` | 🔒 | Get messages in a room |
| GET | `/api/rooms` | 🔒 | Get all my rooms |
| WS | `/ws` (SockJS) | 🔒 (header) | WebSocket connect |
| WS send | `/app/chat/{roomId}` | — | Send a message |
| WS sub | `/topic/room.{roomId}` | — | Receive messages |
| WS sub | `/topic/user.{userId}` | — | Receive notifications |

---

## Common Errors

| Status | Meaning |
|---|---|
| `400` | Bad request — check your request body/fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — you don't have permission (e.g. editing someone else's stay) |
| `404` | Not found — wrong ID |

---

## How to attach the token (example utility)

```js
const BASE_URL = "http://localhost:8081";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
  };
}

// Example: fetch my profile
async function getMyProfile() {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: authHeaders(),
  });
  return res.json();
}
```

