# 2FA Frontend Linking Guide

This guide explains how the front-end should integrate the current 2FA backend flow.

## Base URL

Use your backend host, for example:

- `http://localhost:8081` (common in this project)
- `http://localhost:8080` (fallback if `SERVER_PORT` is not set)

---

## Quick Flow (Frontend)

1. User logs in with email/password (`POST /api/auth/login`).
2. If login returns a token, user is fully logged in.
3. If login returns `token: null`, treat this as **2FA required** and show the TOTP screen.
4. Submit TOTP with email to `POST /api/auth/2fa/verify-login`.
5. Save returned JWT and continue normally.

---

## Endpoint Contracts

### 1) Login (first step)

**POST** `/api/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response when 2FA is not enabled:

```json
{
  "token": "eyJhbGciOiJI..."
}
```

Response when 2FA is enabled (current backend behavior):

```json
{
  "token": null
}
```

Frontend rule:

- `token` exists -> login success.
- `token` is `null` -> open 2FA verification UI.

---

### 2) Setup 2FA (enable flow)

**POST** `/api/auth/2fa/setup`

Headers:

```http
Authorization: Bearer <jwt_token>
```

Body: none.

Success response:

```json
{
  "qrCodeUrl": "otpauth://totp/DarLink:user@example.com?secret=BASE32SECRET&issuer=DarLink",
  "secret": "BASE32SECRET"
}
```

Frontend use:

- Show QR using `qrCodeUrl`.
- Optionally show `secret` for manual entry in authenticator app.

---

### 3) Verify 2FA setup (enable confirmation)

**POST** `/api/auth/2fa/verify-setup`

Headers:

```http
Authorization: Bearer <jwt_token>
```

Request:

```json
{
  "totpCode": "123456"
}
```

Success response:

```json
{
  "message": "2FA enabled successfully"
}
```

Possible error:

- `400` with `"Invalid TOTP code"`

Frontend use:

- If success: mark account as 2FA enabled in UI.
- If error: show inline message and allow retry.

---

### 4) Verify login with 2FA

**POST** `/api/auth/2fa/verify-login`

Headers: none required (public endpoint in current security config).

Request:

```json
{
  "email": "user@example.com",
  "totpCode": "123456"
}
```

Success response:

```json
{
  "token": "eyJhbGciOiJI..."
}
```

Possible errors:

- `400` `"Invalid TOTP code"`
- `400` `"2FA not enabled for this user"`

Frontend use:

- On success, store token and continue to protected pages.

---

### 5) Disable 2FA

**DELETE** `/api/auth/2fa/disable`

Headers:

```http
Authorization: Bearer <jwt_token>
```

Success response:

```json
{
  "message": "2FA disabled successfully"
}
```

---

## UI State Suggestions

Use explicit states to avoid confusion:

- `idle`
- `loading`
- `awaiting_2fa_code`
- `2fa_setup_pending_verification`
- `authenticated`
- `error`

Recommended login transition:

- Submit email/password -> `loading`
- If `token` present -> `authenticated`
- If `token === null` -> `awaiting_2fa_code`
- On valid TOTP -> `authenticated`

---

## Error Handling Map

- `Invalid TOTP code` -> "The code is invalid or expired. Try the latest code."
- `User not found` -> generic auth error (avoid leaking account details in UI copy)
- `2FA not enabled for this user` -> return user to normal login path or account settings
- Any other `400/401` -> show generic message + keep entered email

---

## Postman Validation Sequence (before UI wiring)

1. `POST /api/auth/register` -> copy token.
2. `POST /api/auth/2fa/setup` with Bearer token -> get `qrCodeUrl` and `secret`.
3. Add secret to Google Authenticator.
4. `POST /api/auth/2fa/verify-setup` with Bearer token and fresh `totpCode` -> success message.
5. `POST /api/auth/login` -> expect `{"token": null}` for this user.
6. `POST /api/auth/2fa/verify-login` with `email + totpCode` -> receive final JWT.

---

## Frontend Notes

- TOTP codes are time-based and expire quickly (usually 30 seconds), so retry with a new code when needed.
- Keep login email in local component state so user does not retype it on the 2FA screen.
- Do not log JWT or TOTP codes in production console logs.

