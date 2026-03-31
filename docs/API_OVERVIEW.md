# DarLink Frontend — Expected API Overview (Mock-driven)

This folder documents the **API contract the frontend expects**, based on the current UI mock data (stays/chat/notifications) and the backend APIs that already exist.

## Base URLs & routing

In the Docker setup you currently run:

- Frontend (Nginx): `https://localhost:1337`
- Frontend (HTTP redirect): `http://localhost:8080` → redirects to `https://localhost:1337`

Because the frontend Nginx proxies `/api/*` to the backend, the simplest frontend calls are **same-origin**:

- `GET https://localhost:1337/api/stays`
- `POST https://localhost:1337/api/auth/login`

The backend itself also listens internally on `http://backend:8081` (and on your host usually at `http://localhost:8081` if you expose it).

## Auth

Protected endpoints require a JWT:

```
Authorization: Bearer <jwt>
```

If missing/invalid, expect `401 Unauthorized`.

### Login with 2FA (expected flow)

- `POST /api/auth/login`
  - If user has 2FA disabled -> returns `{ "token": "..." }`
  - If user has 2FA enabled -> currently returns `{ "token": null }`
  - (legacy/fallback handling) frontend can also treat `403` as 2FA-required if encountered
- Then call `POST /api/auth/2fa/verify-login` to complete login and obtain the token.

See full endpoint contracts and copy-paste examples in `src/front-end/docs/2fa-test.md`.

## Common status codes

- `200 OK` — success
- `201 Created` — success (optional; backend may still use 200)
- `204 No Content` — delete success
- `400 Bad Request` — validation error
- `401 Unauthorized` — missing/invalid token
- `403 Forbidden` — authenticated but not allowed
- `404 Not Found` — resource not found

## Common response conventions

- **IDs**: backend uses numeric IDs for most resources; the current UI mocks use strings like `"stay-1"`. For real API integration, prefer numeric `id` and keep UI route params as strings but parse them when needed.
- **Dates**:
  - Booking dates: `YYYY-MM-DD`
  - Timestamps: ISO-8601 (e.g. `2026-03-28T09:48:45Z`)

## Core frontend models (from mock UI)

### Listing (Stay) model the UI renders

The UI currently expects a shape like:

```json
{
  "id": "stay-1",
  "city": "Rabat",
  "type": "Private",
  "avSlots": 2,
  "price": 800,
  "photos": ["https://..."],
  "details": "...",
  "included": ["Wi-Fi included"],
  "expectations": ["Quiet at night"],
  "owner": {
    "id": "owner-1",
    "name": "Mohamed Sonbol",
    "image": "https://..."
  },
  "admin": false
}
```

> The backend currently returns a different shape (e.g. `pricePerNight`, `photoUrl`, `hostUsername`). Each API doc below includes a recommended mapping section.

### Notification model the UI uses

The UI’s notification context expects:

```json
{
  "id": 123,
  "type": "slot_request",
  "message": "New slot request for Rabat",
  "link": "/chat/owner-1/stay-1",
  "read": false,
  "timestamp": "2026-03-28T10:00:00Z"
}
```

### Chat model (UI mock)

UI mock messages look like:

```json
{ "id": 1, "text": "Hello", "from": "me" }
```

Backend chat messages use:

```json
{ "id": 1, "content": "Hello", "sentAt": "...", "senderId": 1, "senderUsername": "john", "roomId": 3 }
```

## Files in this folder

- `API_AUTH_USERS.md`
- `API_LISTINGS_STAYS.md`
- `API_UPLOADS.md`
- `API_SEARCH_FILTERS.md`
- `API_SLOT_REQUESTS.md`
- `API_CHAT_AND_FRIENDS.md`
- `API_NOTIFICATIONS.md`
