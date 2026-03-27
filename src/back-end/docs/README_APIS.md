# DarLink Backend API README

This file is a quick, production-friendly API guide for the backend under `back-end/src/main/java/com/DarLink/DarLink/Controller`.

- Base URL (local): `http://localhost:8081`
- Content type: `application/json`
- Auth: JWT Bearer token for protected routes

## Authentication

For protected endpoints, send:

```http
Authorization: Bearer <jwt_token>
```

---

## 1) Auth APIs

### Public
- `POST /api/auth/register`
- `POST /api/auth/login`

### 2FA (requires authenticated user unless stated)
- `POST /api/auth/2fa/setup`
- `POST /api/auth/2fa/verify-setup`
- `POST /api/auth/2fa/verify-login` (login continuation)
- `DELETE /api/auth/2fa/disable`

### Example - Register
```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "token": "<jwt>"
}
```

### Example - Login with potential 2FA flow
```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

- If 2FA is not required: returns token.
- If 2FA is required: backend returns `403` with message `2FA required`, then call `/api/auth/2fa/verify-login`.

---

## 2) User APIs

Protected:
- `GET /api/users/me`
- `PATCH /api/users/me`

### Example - Update profile
```http
PATCH /api/users/me
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

```json
{
  "bio": "Roommate friendly and clean",
  "city": "Rabat",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

---

## 3) Stay APIs

Public:
- `GET /api/stays`
- `GET /api/stays/{id}`
- `GET /api/stays/page?page=0`

Protected:
- `POST /api/stays/create`
- `PUT /api/stays/{id}`
- `DELETE /api/stays/{id}`

### Search query params currently supported by backend
- `city` (exact city, case-insensitive)
- `maxPrice` (numeric upper bound)

Example:
- `GET /api/stays?city=Casablanca`
- `GET /api/stays?maxPrice=2000`

> Current controller behavior applies only one filter at a time in this order: `city` first, then `maxPrice`.

### Example - Create stay
```http
POST /api/stays/create
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

```json
{
  "name": "Cozy Private Room",
  "description": "Near tram station",
  "city": "Casablanca",
  "address": "12 Rue Hassan II",
  "pricePerNight": 1500,
  "photoUrl": "https://example.com/stay.jpg"
}
```

---

## 4) Slot Request APIs (booking requests)

Protected:
- `POST /api/slot-requests`
- `GET /api/slot-requests/me`
- `GET /api/slot-requests/host`
- `PATCH /api/slot-requests/{id}/status`

### Example - Create slot request
```http
POST /api/slot-requests
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

```json
{
  "stayId": 1,
  "startDate": "2026-04-01",
  "endDate": "2026-04-10"
}
```

### Example - Update slot request status
```http
PATCH /api/slot-requests/12/status
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

```json
{
  "status": "ACCEPTED"
}
```

---

## 5) Chat APIs

Protected:
- `POST /api/rooms?user2Id={id}`
- `GET /api/rooms/between?user2Id={id}`
- `GET /api/rooms/messages?roomId={id}`
- `GET /api/rooms`

### WebSocket
- Client send destination: `/app/chat/{roomId}`
- Subscribe topic: `/topic/room.{roomId}`

Example message payload over WebSocket:

```json
{
  "content": "Salam, is this room still available?"
}
```

---

## 6) Notification APIs

Protected:
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `POST /api/notifications/read`

### Example - Mark all notifications as read
```http
POST /api/notifications/read
Authorization: Bearer <jwt_token>
```

Response body:

```json
"All notifications marked as read"
```

---

## Common status codes

- `200 OK`: success
- `204 No Content`: delete success
- `400 Bad Request`: validation or domain error
- `401 Unauthorized`: missing/invalid token
- `403 Forbidden`: authenticated but not allowed (or 2FA required in login flow)
- `404 Not Found`: resource not found

---

## Notes for frontend integration

- For production, keep one API base URL in frontend config (env var).
- Always attach JWT on protected requests.
- For search filters, see `back-end/docs/README_SEARCH_FILTER.md`.

