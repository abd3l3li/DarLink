# DarLink – Two-Factor Authentication (2FA) Implementation Plan

## 1) Purpose

This document defines a full implementation plan for adding Two-Factor Authentication (2FA) to DarLink’s current authentication system (JWT + OAuth2). It is designed to be implementation-ready and aligned with the existing backend/frontend architecture.

---

## 2) Current Authentication Architecture (Observed)

### Backend (Spring Boot)
- Auth base route: `POST /api/auth/*`
- Existing endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Security:
  - `SecurityConfig` uses stateless JWT (`SessionCreationPolicy.STATELESS`)
  - JWT filter: `JwtAuthenticationFilter`
  - OAuth2 login is enabled via `oauth2Login(...)`
  - `/api/auth/**` is currently public
- OAuth2 flow:
  - `OAuth2SuccessHandler` creates/uses account and emits token via callback URL query param

### Frontend (React)
- Login request from `Right_Side_2.jsx` to:
  - `https://localhost:8443/api/auth/login`
- Token storage:
  - JWT saved in `localStorage` (e.g. `localStorage.setItem("token", data.token)`)
- OAuth callback:
  - `AuthCallback.jsx` reads `token` from URL query and stores it in `localStorage`

---

## 3) 2FA Goals

1. Add optional 2FA per user account (phase 1), then support mandatory mode (phase 2 if needed).
2. Support standard authenticator apps (TOTP RFC 6238: Google Authenticator, Authy, 1Password, etc.).
3. Ensure:
   - Password/OAuth step first
   - Second factor challenge before issuing final access JWT
4. Keep compatibility with existing JWT flow and frontend routing.
5. Include backup/recovery mechanisms to avoid lockouts.

---

## 4) Recommended 2FA Type

## Primary: TOTP (Authenticator App)
Why:
- Industry standard and offline-capable
- No SMS cost or SIM swap risk
- Good UX after setup

## Optional later:
- Email OTP (fallback only)
- WebAuthn/Passkeys (future security upgrade)

---

## 5) High-Level Login Flow After 2FA

### A. User without 2FA enabled
1. Submit login credentials
2. Validate credentials
3. Issue JWT immediately (same as now)

### B. User with 2FA enabled
1. Submit login credentials
2. Validate credentials
3. Return `MFA_REQUIRED` with temporary challenge token
4. User submits TOTP code + challenge token
5. Server validates TOTP
6. Issue final JWT

### C. OAuth2 user with 2FA enabled
1. OAuth provider authenticates user
2. On success handler, do **not** immediately issue final JWT if 2FA is enabled
3. Return/redirect to frontend MFA step with short-lived challenge token
4. User enters TOTP
5. Issue final JWT

---

## 6) Data Model Changes

Add fields to `User` (or equivalent account table):

- `twoFactorEnabled` (boolean, default false)
- `twoFactorSecretEncrypted` (string, nullable)
- `twoFactorEnabledAt` (timestamp, nullable)
- `backupCodesHash` (json/text, nullable) – hashes only, never plain values
- `twoFactorFailedAttempts` (int, default 0)
- `twoFactorLockedUntil` (timestamp, nullable)

Optional audit/security table:
- `auth_event_log`
  - `id`
  - `user_id`
  - `event_type` (`LOGIN_SUCCESS`, `MFA_REQUIRED`, `MFA_SUCCESS`, `MFA_FAILED`, `MFA_LOCKED`, `MFA_DISABLED`, etc.)
  - `ip`
  - `user_agent`
  - `created_at`

---

## 7) API Design (New Endpoints)

Base path suggestion: `/api/auth/2fa`

## Setup phase
### `POST /api/auth/2fa/setup/init`
Auth required (already logged in), body empty  
Returns:
- `secret` (only once during setup, never again)
- `otpauthUrl`
- `qrCodeDataUrl` (optional, pre-generated QR image base64)

### `POST /api/auth/2fa/setup/verify`
Auth required, body:
```json
{ "code": "123456" }
```
If valid:
- set `twoFactorEnabled = true`
- generate backup codes (show once)
- return backup codes (plain only this response)

### `POST /api/auth/2fa/disable`
Auth required, body:
```json
{ "password": "current-password", "code": "123456" }
```
Require re-auth confirmation before disabling.

---

## Login challenge phase
### Update `POST /api/auth/login`
Current successful response likely includes token.  
New behavior:
- if user has no 2FA: return token as before
- if user has 2FA:
```json
{
  "status": "MFA_REQUIRED",
  "challengeToken": "short-lived-jwt-or-random-token",
  "expiresIn": 180
}
```

### `POST /api/auth/2fa/verify`
Body:
```json
{
  "challengeToken": "....",
  "code": "123456"
}
```
If valid -> return final auth response (JWT, user info)

### `POST /api/auth/2fa/verify-backup`
Body:
```json
{
  "challengeToken": "....",
  "backupCode": "ABCD-EFGH"
}
```
If valid:
- consume one backup code
- issue final JWT

---

## 8) Challenge Token Strategy

Use short-lived token (3–5 min), signed and scoped:
- claims:
  - `sub` user id/email
  - `type = MFA_CHALLENGE`
  - `iat`, `exp`
  - optional nonce/session id
- not usable as API access token
- only accepted by `/api/auth/2fa/verify*`

Alternative: server-side challenge store in DB/Redis.

---

## 9) Security Rules & Hardening

1. Encrypt TOTP secret at rest (AES with server-managed key; never plaintext in DB dump).
2. Rate limit:
   - Max attempts per challenge (e.g. 5)
   - Per IP + per account throttling
3. Lockout policy:
   - Temporary lock after repeated failures (e.g. 15 min)
4. TOTP validation window:
   - ±1 step (30s) for clock drift
5. Force HTTPS only in production
6. Never log:
   - OTP codes
   - secrets
   - backup codes
7. Backup code policy:
   - one-time use
   - hashed (bcrypt/argon2)
   - regenerate invalidates old list
8. CSRF considerations:
   - if staying JWT stateless API with Authorization header, current approach is fine
9. Token storage note:
   - current frontend uses `localStorage`; for stronger XSS resistance, consider HttpOnly secure cookies in future phase

---

## 10) Backend Implementation Plan (Spring)

## Step 1: Domain + persistence
- Extend `User` entity with 2FA fields
- Create migration (Flyway/Liquibase preferred)
- Add repository methods as needed

## Step 2: 2FA service
Create `TwoFactorService`:
- `generateSecret()`
- `buildOtpAuthUrl(email, issuer, secret)`
- `generateQrDataUrl(otpauthUrl)` (optional)
- `verifyCode(secret, code)`
- `generateBackupCodes()`
- `hashBackupCodes(codes)`

Recommended libraries:
- TOTP: `com.warrenstrange:googleauth` (or equivalent)
- QR generation: ZXing

## Step 3: Auth flow updates
In `AuthService.login(...)`:
- after password check:
  - if 2FA disabled -> existing behavior
  - if enabled -> return `MFA_REQUIRED` challenge response

In OAuth2 success handler:
- if user has 2FA enabled:
  - redirect frontend to MFA page with challenge token (not final token)
- else existing token behavior

## Step 4: new controller endpoints
Create `TwoFactorController` with:
- setup/init
- setup/verify
- disable
- verify challenge
- verify backup code

## Step 5: JWT/challenge support
- Add challenge token creation/validation methods in JWT service
- Ensure API token and challenge token are distinct (`type` claim)

## Step 6: auditing + alerts
- Log auth security events
- Optional email alert on MFA disable/login from new device

---

## 11) Frontend Implementation Plan (React)

## New pages/components
- `SecuritySettings` page:
  - Enable 2FA button
  - QR display
  - Verify code field
  - Show backup codes once with “Download / Copy / Print”
- `MfaChallenge` page:
  - input OTP
  - fallback “Use backup code”

## Login flow updates
Current:
- login -> receives token -> save localStorage -> navigate
New:
- login response branch:
  - if `token` exists: old behavior
  - if `status === MFA_REQUIRED`: route to `/mfa` with challenge token in memory/state (or secure temp storage)
- on `/mfa` submit:
  - call `/api/auth/2fa/verify`
  - on success store final JWT and navigate

## OAuth callback updates
Current `AuthCallback.jsx` expects `token` query.
New:
- handle either:
  - `token` (no 2FA)
  - `mfa_challenge` (2FA required) => route to `/mfa`

---

## 12) UX Requirements

1. Clear messaging:
   - “2FA required for this account”
   - “Code invalid or expired”
2. Countdown for challenge expiry
3. Retry with sensible error states
4. Backup code education:
   - show once
   - warn to store securely
5. Recovery path:
   - account recovery support flow for lost authenticator device

---

## 13) Testing Strategy

## Unit tests
- TOTP code verification valid/invalid/drift window
- Backup code hash/consume behavior
- challenge token type/expiry enforcement

## Integration tests
- Login without 2FA returns normal token
- Login with 2FA returns `MFA_REQUIRED`
- Verify valid code returns final token
- Invalid attempts produce throttling/lockout

## E2E tests
- Enable 2FA from settings
- Logout/login + MFA challenge
- OAuth login + MFA challenge
- Backup code login fallback

---

## 14) Rollout Plan

## Phase 0 (dev/staging)
- feature flag: `auth.2fa.enabled=true`
- internal QA users only

## Phase 1 (optional users)
- expose “Enable 2FA” in user settings
- monitor failures/support tickets

## Phase 2 (policy enforcement)
- optionally require 2FA for admin/high-privilege roles first
- then wider enforcement if needed

---

## 15) Risks & Mitigations

1. **User lockout**
   - backup codes + recovery flow
2. **Clock drift issues**
   - allow ±1 time step
3. **Phishing risk**
   - educate users, later add WebAuthn
4. **XSS token theft (localStorage)**
   - plan migration to HttpOnly cookie strategy later

---

## 16) Suggested Milestone Checklist

- [ ] DB migration for 2FA fields
- [ ] TOTP service implemented
- [ ] Setup endpoints done
- [ ] Login challenge flow done
- [ ] OAuth2 + 2FA branch done
- [ ] Frontend MFA page done
- [ ] Backup codes done
- [ ] Rate limiting + lockout done
- [ ] Tests (unit/integration/e2e) done
- [ ] Docs + runbook + support flow done

---

## 17) Example Response Contracts

### Login (2FA enabled)
```json
{
  "status": "MFA_REQUIRED",
  "challengeToken": "eyJhbGciOi...",
  "expiresIn": 180
}
```

### Verify MFA success
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 42,
    "email": "user@example.com"
  }
}
```

### Setup init
```json
{
  "secret": "BASE32SECRET",
  "otpauthUrl": "otpauth://totp/DarLink:user@example.com?secret=BASE32SECRET&issuer=DarLink",
  "qrCodeDataUrl": "data:image/png;base64,iVBORw0..."
}
```

---

## 18) Final Recommendation

Implement TOTP first with clean challenge-token architecture and backup codes.  
Keep current JWT architecture, but separate “MFA challenge” from “API access token” strictly.  
Roll out behind a feature flag, collect metrics, then expand enforcement gradually.

