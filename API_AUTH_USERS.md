# Auth + Users — Expected Endpoints

This doc describes the **frontend-expected** endpoints for authentication and user profile management.

> Note: Most endpoints described here already exist on the backend under `/api/auth/*` and `/api/users/*`.

---

## Auth headers

Protected endpoints require:

```
Authorization: Bearer <jwt>
```

---

## Register

### POST `/api/auth/register` (public)

Creates a new account.

**Request**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{ "token": "<jwt>" }
```

**Common errors**
- `400` email already used / validation

---

## Login

### POST `/api/auth/login` (public)

**Request**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200` (no 2FA required)**
```json
{ "token": "<jwt>" }
```

**Response `403` (2FA required)**

Backend may return an error body like:

```json
{ "error": "2FA required" }
```

Frontend should then call `POST /api/auth/2fa/verify-login`.

**Common errors**
- `401` invalid credentials

---

## 2FA (TOTP)

### POST `/api/auth/2fa/setup` (protected)

Returns a setup payload (example shape):

```json
{
  "secret": "BASE32SECRET",
  "otpauthUrl": "otpauth://totp/...",
  "qrCodeDataUrl": "data:image/png;base64,..."
}
```

### POST `/api/auth/2fa/verify-setup` (protected)

Verify the code shown in the authenticator app.

**Request**
```json
{ "code": "123456" }
```

**Response `200`**
```json
{ "twoFactorEnabled": true }
```

### POST `/api/auth/2fa/verify-login` (public-ish continuation)

Completes a login that was blocked by 2FA.

**Request**
```json
{
  "email": "john@example.com",
  "password": "secret123",
  "code": "123456"
}
```

**Response `200`**
```json
{ "token": "<jwt>" }
```

### DELETE `/api/auth/2fa/disable` (protected)

Disables 2FA.

**Response `200`**
```json
{ "twoFactorEnabled": false }
```

---

## OAuth2 login (Google / 42)

Frontend currently links to:

- `GET /oauth2/authorization/google`
- `GET /oauth2/authorization/42`

After success, backend redirects the browser to:

- `/auth/callback?token=<jwt>`

The frontend route handler saves the token to `localStorage`.

> In the current Docker setup, you can hit these via the frontend domain (recommended):
> - `https://localhost:1337/oauth2/authorization/google`
> - `https://localhost:1337/oauth2/authorization/42`

---

## My profile

### GET `/api/users/me` (protected)

**Response `200`**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "bio": "Hi, I love travelling!",
  "city": "Casablanca",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2026-03-28T10:00:00Z"
}
```

### PATCH `/api/users/me` (protected)

**Request** (all optional)
```json
{
  "bio": "Updated bio",
  "city": "Rabat",
  "avatarUrl": "https://example.com/new.jpg"
}
```

**Response `200`**: same shape as `GET /api/users/me`

---

## Suggested extra endpoints (not required by current backend)

These are useful because the UI frequently shows the listing owner profile.

### GET `/api/users/{id}` (public)

**Response `200`**
```json
{
  "id": 7,
  "username": "host_user",
  "city": "Rabat",
  "avatarUrl": "https://...",
  "createdAt": "..."
}
```

### GET `/api/users/{id}/stats` (public)

Could power chat profile modal:

```json
{
  "listingsCount": 3,
  "online": false
}
```
