# 2FA API Guide for Frontend

This document is the frontend reference for the current backend 2FA behavior.

It is based on these backend routes:

- `POST /api/auth/login`
- `POST /api/auth/2fa/setup`
- `POST /api/auth/2fa/verify-setup`
- `POST /api/auth/2fa/verify-login`
- `DELETE /api/auth/2fa/disable`

## Base URL

Use one of these depending on your setup:

- `https://localhost:1337` (recommended if frontend proxy is running)
- `http://localhost:8081` (direct backend)

Examples in this doc use relative paths like `/api/auth/login`.

---

## Frontend Login Flow (Current)

1. User submits email/password to `POST /api/auth/login`.
2. If response has `token` string: user is fully authenticated.
3. If response is `{ "token": null }`: user must complete 2FA.
4. Show TOTP input UI and call `POST /api/auth/2fa/verify-login` with `email + totpCode`.
5. Save returned JWT and continue to protected pages.

---

## Endpoint Contracts

### 1) Login

**POST** `/api/auth/login` (public)

Request:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Success (no 2FA enabled):

```json
{
  "token": "eyJhbGciOiJI..."
}
```

Success (2FA enabled):

```json
{
  "token": null
}
```

Frontend decision rule:

- `token` is a non-empty string: login done.
- `token === null`: route to 2FA verification step.

---

### 2) Setup 2FA (Generate secret + QR URL)

**POST** `/api/auth/2fa/setup` (protected)

Headers:

```http
Authorization: Bearer <jwt_token>
```

Body: none

Success:

```json
{
  "qrCodeUrl": "otpauth://totp/DarLink:user@example.com?secret=BASE32SECRET&issuer=DarLink",
  "secret": "BASE32SECRET"
}
```

Frontend usage:

- Render QR from `qrCodeUrl`.
- Provide `secret` copy button for manual authenticator entry.

---

### 3) Verify setup and enable 2FA

**POST** `/api/auth/2fa/verify-setup` (protected)

Headers:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

Request:

```json
{
  "totpCode": "123456"
}
```

Success:

```json
{
  "message": "2FA enabled successfully"
}
```

Common failures:

- `400` `Invalid TOTP code`
- `400` `Error: User not found`

---

### 4) Verify login with TOTP

**POST** `/api/auth/2fa/verify-login` (public)

Request:

```json
{
  "email": "user@example.com",
  "totpCode": "123456"
}
```

Success:

```json
{
  "token": "eyJhbGciOiJI..."
}
```

Common failures:

- `400` `Invalid TOTP code`
- `400` `2FA not enabled for this user`
- `400` `Error: User not found`

---

### 5) Disable 2FA

**DELETE** `/api/auth/2fa/disable` (protected)

Headers:

```http
Authorization: Bearer <jwt_token>
```

Success:

```json
{
  "message": "2FA disabled successfully"
}
```

---

## Copy-Paste Frontend Snippets

### Login step

```js
const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

const data = await res.json();

if (data.token) {
  localStorage.setItem("token", data.token);
  // navigate to app
} else {
  // token is null => ask for TOTP
  setPending2faEmail(email);
  setAuthStep("awaiting_2fa_code");
}
```

### Verify login TOTP step

```js
const res = await fetch("/api/auth/2fa/verify-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: pending2faEmail, totpCode })
});

const data = await res.json();

if (res.ok && data.token) {
  localStorage.setItem("token", data.token);
  // navigate to app
} else {
  setError(typeof data === "string" ? data : "Invalid code or expired code");
}
```

---

## Suggested UI States

- `idle`
- `login_loading`
- `awaiting_2fa_code`
- `setup_2fa_pending`
- `authenticated`
- `error`

State transition for login:

- submit credentials -> `login_loading`
- receive token -> `authenticated`
- receive `token: null` -> `awaiting_2fa_code`
- valid `verify-login` token -> `authenticated`

---

## Postman Test Steps (Quick)

1) Register a user:

`POST /api/auth/register`

```json
{
  "username": "front2fa",
  "email": "front2fa@example.com",
  "password": "secret123"
}
```

Copy returned JWT as `token`.

2) Setup 2FA:

`POST /api/auth/2fa/setup` with header `Authorization: Bearer <token>`

Copy `secret` from response into Google Authenticator.

3) Verify setup:

`POST /api/auth/2fa/verify-setup` with Bearer token

```json
{
  "totpCode": "123456"
}
```

4) Test login now requires 2FA:

`POST /api/auth/login`

```json
{
  "email": "front2fa@example.com",
  "password": "secret123"
}
```

Expected response:

```json
{
  "token": null
}
```

5) Complete login with TOTP:

`POST /api/auth/2fa/verify-login`

```json
{
  "email": "front2fa@example.com",
  "totpCode": "123456"
}
```

Expected response contains final JWT token.

---

## Important Notes

- TOTP codes change every ~30 seconds; always test with a fresh code.
- Keep the login email in state between step 1 and step 2.
- Do not log JWT, secret, or TOTP values in production logs.
- Current `verify-login` takes only `email + totpCode` (no challenge token yet).

