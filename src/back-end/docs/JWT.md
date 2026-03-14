# JWT in DarLink Back-End (Simple Guide)

This file explains JWT in our project in a simple way: where it starts, why we added each part, how it works under the hood, and when we need it.

---

## 1) Where JWT starts in this project

JWT starts at authentication endpoints in `AuthController`:

- `POST /api/auth/register`
- `POST /api/auth/login`

Flow:

1. User sends email/password (and username for register).
2. `AuthService` handles business logic.
3. On success, `JwtService` creates a token.
4. API returns `{ "token": "..." }`.
5. Front-end stores token and sends it later as:
   - `Authorization: Bearer <token>`

Why we started here:

- We needed stateless auth for API calls.
- We did not want server-side sessions.
- JWT lets each request carry proof of identity.

When we need this:

- Every login/register now.
- Every protected endpoint later (profile, stays, messages, notifications, etc.).

---

## 2) The main classes and why each exists

### `AuthController`

What it does:

- Exposes public auth routes under `/api/auth`.

Why we need it:

- It is the HTTP entry point for login and register.

When we need it:

- Whenever front-end calls auth endpoints.

---

### `AuthService`

What it does:

- `register(...)`: checks duplicate email, hashes password, saves user, issues JWT.
- `login(...)`: asks Spring Security to verify credentials, then issues JWT.

Why we need it:

- Keeps auth logic in one service layer, not inside controller.

When we need it:

- On every register/login request.

---

### `CustomUserDetailsService`

What it does:

- Implements `UserDetailsService`.
- Loads user by email from `UserRepository`.
- Converts your `User` entity to Spring Security `UserDetails`.

Why we need it:

- Spring Security authentication manager needs a `UserDetailsService` to fetch user credentials from DB.

When we need it:

- During `authenticationManager.authenticate(...)` in login.

---

### `JwtService`

What it does:

- `generateToken(email)`
- `extractEmail(token)`
- `isTokenValid(token, email)`
- private expiration check

Why we need it:

- Central place for token creation and validation logic.

When we need it:

- Now for creating tokens.
- Later in JWT filter for validating token on every protected request.

---

### `JwtConfig`

What it does:

- Binds `jwt.secret` and `jwt.expiration` from config.

Why we need it:

- Clean typed config object instead of hardcoding values.

When we need it:

- Whenever `JwtService` signs/parses tokens.

---

### `SecurityConfig`

What it does now:

- Disables CSRF.
- Provides `PasswordEncoder` bean (`BCryptPasswordEncoder`).
- Exposes `AuthenticationManager` bean.

What is still commented and pending:

- Stateless session policy.
- Route authorization rules.
- This is waiting for JWT request filter implementation.

Why we need it:

- It wires Spring Security behavior for the whole app.

When we need it:

- Always; this is global security setup.

---

## 3) Annotation cheat sheet (what each one really does)

### Spring stereotypes

- `@RestController`
  - Marks class as REST controller.
  - Spring auto-registers endpoints and JSON serialization.

- `@Service`
  - Marks class as service bean.
  - Spring creates and manages one instance in the application context.

- `@Configuration`
  - Class provides bean definitions/config.

- `@EnableWebSecurity`
  - Enables Spring Security web integration and filter chain support.

### Mapping and request annotations

- `@RequestMapping("/api/auth")`
  - Base path for controller routes.

- `@PostMapping("/login")`, `@PostMapping("/register")`
  - Map HTTP POST endpoints.

- `@RequestBody`
  - Converts incoming JSON body to Java DTO.

### Bean/config annotations

- `@Bean`
  - Registers method return value as managed Spring bean.

- `@ConfigurationProperties(prefix = "jwt")`
  - Automatically maps `jwt.*` properties into fields of `JwtConfig`.

### Interface/override

- `implements UserDetailsService`
  - Contract Spring Security uses to load users.

- `@Override`
  - Compile-time safety that method matches parent contract.

---

## 4) The "magic" under the hood (not really magic)

### A) Dependency injection

How constructors get objects without `new`:

- Spring scans classes with `@Service`, `@Configuration`, `@RestController`.
- Builds beans at startup.
- Sees constructor dependencies and injects matching beans.

Example in practice:

- `AuthService` constructor asks for `UserRepository`, `PasswordEncoder`, `JwtService`, `AuthenticationManager`.
- Spring provides all automatically from context.

Why this matters:

- Loose coupling, easier testing, cleaner architecture.

---

### B) Login credential verification

In `AuthService.login(...)`:

- Code calls `authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password))`.

Under the hood Spring Security does:

1. Uses `UserDetailsService` (your `CustomUserDetailsService`) to load user by email.
2. Reads hashed password from DB.
3. Uses configured `PasswordEncoder` (BCrypt) to compare raw password with hash.
4. Throws if invalid; returns success if valid.

Why this matters:

- You do not manually compare passwords.
- Built-in secure flow avoids common mistakes.

---

### C) JWT creation and verification internals

`JwtService.generateToken(email)` builds a signed JWT with:

- Subject: user email
- Issued-at time
- Expiration time
- Signature using HMAC key from secret

Token structure conceptually:

- Header: algorithm metadata
- Payload: claims (subject, iat, exp)
- Signature: cryptographic proof

When parsing token (`extractEmail`):

- Parser verifies signature with same secret key.
- If signature or format is wrong, parsing fails.
- If valid, claims are read and subject is returned.

Why this matters:

- Server can trust token came from itself and was not modified.

---

## 5) What is complete vs what is next

Complete now:

- Register/login endpoints.
- Password hashing with BCrypt.
- JWT issuance.
- JWT helper methods for validation/parsing.

Next required step:

- Add JWT authentication filter (usually extending `OncePerRequestFilter`) that:
  1. Reads `Authorization` header.
  2. Extracts bearer token.
  3. Validates token via `JwtService`.
  4. Loads user details.
  5. Sets `SecurityContext` so request is authenticated.

After filter is in place:

- Enable stateless sessions in `SecurityConfig`.
- Enable route protection (`/api/auth/**` public, rest protected).

When we need this:

- As soon as we start securing non-auth endpoints.

---

## 6) One request example (end-to-end)

Login request:

1. Front-end sends `POST /api/auth/login` with email/password.
2. `AuthController` forwards to `AuthService`.
3. `AuthenticationManager` validates credentials (using `CustomUserDetailsService` + BCrypt).
4. On success, `JwtService` signs token.
5. Response returns token.
6. Front-end stores token.
7. Future request sends `Authorization: Bearer <token>`.
8. Future JWT filter (to be added) will authenticate request automatically.

That is the full JWT story in this codebase right now.

