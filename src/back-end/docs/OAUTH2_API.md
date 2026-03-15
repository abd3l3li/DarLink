# DarLink — Authentication API

This document covers the OAuth2 login flow and JWT token usage.

---

## Base URL

```
https://localhost:8443
```

---

## Login

The app supports two OAuth2 providers. Direct the user to one of these URLs:

```
Login with Google → https://localhost:8443/oauth2/authorization/google
Login with 42     → https://localhost:8443/oauth2/authorization/42
```

These URLs are generated automatically by Spring Boot. No backend code needed.

---

## After Login

After a successful login the server redirects the browser to:

```
https://localhost:8443/auth/callback?token=eyJhbGc...
```

Read the token from the URL and store it:

```javascript
const token = new URLSearchParams(window.location.search).get('token');
localStorage.setItem('token', token);
```

Then redirect the user to the home page.

---

## Using The Token

Include the token in every request:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

Without a token the server returns:
```json
{ "error": "Unauthorized" }
```

---

## Token Structure

The JWT token contains the user's email as the subject:

```javascript
// decode token
const payload = JSON.parse(atob(token.split('.')[1]));
const email = payload.sub;       // user email
const exp   = payload.exp;       // expiration timestamp
const iat   = payload.iat;       // issued at timestamp
```

---

## Token Expiration

Tokens expire after 7 days. When a token expires the server returns `401 Unauthorized`. The frontend should redirect the user to the login page.

---

## New User Registration

New users are automatically registered on first login. No separate registration step needed for OAuth2 users.

```
First login
→ server checks if email exists in DB
→ not found → creates new user automatically
→ found     → uses existing user
→ issues JWT in both cases
```
