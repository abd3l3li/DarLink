# DarLink Back-End — What We Built, Why, and How It Works

> **Stack:** Java 17 · Spring Boot 3.5.11 · Spring Security · Spring Data JPA · PostgreSQL · JWT (jjwt 0.12.5) · Docker / Docker Compose

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Infrastructure & Docker Setup](#2-infrastructure--docker-setup)
3. [Configuration Layer](#3-configuration-layer)
4. [Entity Layer — The Data Model](#4-entity-layer--the-data-model)
5. [Repository Layer — Database Access](#5-repository-layer--database-access)
6. [Security Layer — JWT + Spring Security](#6-security-layer--jwt--spring-security)
7. [DTO Layer — Data Transfer Objects](#7-dto-layer--data-transfer-objects)
8. [Service Layer — Business Logic](#8-service-layer--business-logic)
9. [Controller Layer — HTTP Endpoints](#9-controller-layer--http-endpoints)
10. [Dev & Test Utilities](#10-dev--test-utilities)
11. [What Is Still Pending / Next Steps](#11-what-is-still-pending--next-steps)
12. [Full Architecture Diagram](#12-full-architecture-diagram)

---

## 1. Project Overview

**DarLink** is a roommate/stay finder platform.  
The back-end is a **REST API** built with Spring Boot. Its job is to:

- Manage users (register, login)
- Manage stays/listings (rooms available to rent)
- Handle booking requests (slot requests)
- Store direct messages between users
- Deliver notifications to users

---

## 2. Infrastructure & Docker Setup

### Files involved
- `Dockerfile` (back-end)
- `compose.yml` (root)
- `db/Dockerfile` + `db/secrets/password.txt`
- `back-end/.env`

---

### `Dockerfile` — Multi-Stage Build with Layer Caching

```dockerfile
FROM maven:3.9.10-eclipse-temurin-21 AS builder   # Stage 1: Build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline                      # Cache dependencies first
COPY src ./src
RUN mvn package -DskipTests                        # Compile & package the .jar

FROM eclipse-temurin:21-jre                        # Stage 2: Run (tiny image)
COPY --from=builder /app/target/*.jar /app.jar
COPY .env .
ENTRYPOINT ["java","-jar","/app.jar"]
```

**Why multi-stage?**  
The final Docker image only contains the JRE + the `.jar` — no Maven, no source code.
This makes it **much smaller and more secure** in production.

**Why Layer Caching?**  
`pom.xml` is copied and dependencies are downloaded **before** copying the source code.
Docker caches this layer. On the next build, if you only changed Java code (not `pom.xml`),
Docker **skips the slow download step** and rebuilds in seconds.

**When will you need this?**  
Every time you run `docker compose up --build`. Understood once, saves hours later.

---

### `compose.yml` — Orchestrates All Services

```
backend  ←→  db (PostgreSQL)
```

| Feature | What it does |
|---|---|
| `depends_on: db` | The backend waits for PostgreSQL to start first |
| `secrets: db-password` | Password is never hardcoded; read from `db/secrets/password.txt` |
| `healthcheck` on db | Docker waits until Postgres is **actually ready** before starting the backend |
| `volumes: db-data` | Database data persists even if the container is deleted |
| `networks: darlink` | Both containers talk to each other on an isolated internal network |

**Why separate services?**  
Following the **single-responsibility principle** — each container does one job.
You can restart, scale, or update one without touching the other.

---

### `.env` — Environment Variables

```dotenv
DB_URL=jdbc:postgresql://db:5432/DarLink
JWT_SECRET=your_super_secret_jwt_key_...
JWT_EXPIRATION=604800000   # 7 days in milliseconds
SERVER_PORT=8081
```

**Why `.env`?**  
Keeps secrets out of the source code. Each developer or environment (dev/staging/prod)
has its own `.env` with different values.  
> ⚠️ `.env` is in `.gitignore` — it is **never** pushed to Git.

---

## 3. Configuration Layer

### `application.properties`

Maps `.env` values into Spring using `${VARIABLE_NAME}` syntax:

```properties
spring.datasource.url=${DB_URL}
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
server.port=${SERVER_PORT:8080}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- `ddl-auto=update` — Hibernate reads your entity classes and **automatically creates/updates the database tables**. Perfect for development; never use in production.
- `show-sql=true` — Prints every SQL query in the terminal. Useful for debugging.

---

### `JwtConfig.java` — JWT Settings as a Java Object

```java
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String secret;
    private long expiration;
    // getters/setters...
}
```

**Why?**  
Instead of using raw `@Value("${jwt.secret}")` everywhere, we wrap the JWT settings
in a typed class. Any component that needs JWT config just injects `JwtConfig`.

---

### `ConfigVerifier.java` — Startup Config Check

Implements `CommandLineRunner` — runs **once at application startup**.
Prints the loaded JWT secret, expiration, and DB URL to the console.

**Why?**  
A quick sanity check to confirm all environment variables were loaded correctly
before the application serves any requests. Saved hours of debugging.

**When to remove it?**  
Before going to production (it prints sensitive config values to the log).

---

## 4. Entity Layer — The Data Model

Entities are Java classes annotated with `@Entity`. Hibernate reads them and
creates/maintains the matching PostgreSQL tables automatically.

---

### `User.java` → table: `users`

| Field | Type | Why |
|---|---|---|
| `id` | `Long` (auto-increment) | Unique identifier for every user |
| `username` | `String` (unique) | Display name, 3–20 characters |
| `email` | `String` (unique) | Used as login identifier |
| `password` | `String` | Stored **hashed** (BCrypt), never plain text |
| `bio` | `String` | Profile description (Phase 3) |
| `city` | `String` | User's city (Phase 3) |
| `avatarUrl` | `String` | Profile picture URL (Phase 4) |
| `createdAt` | `LocalDateTime` | Set automatically via `@PrePersist` |

**Why `@Table(name = "users")` instead of `user`?**  
`user` is a **reserved keyword** in PostgreSQL. Using it as a table name causes errors.

**Why `@PrePersist`?**  
The `onCreate()` method fires **automatically before INSERT**. The `createdAt` timestamp
is always accurate — you never have to set it manually.

---

### `Stay.java` → table: `stays`

Represents a room/property listing posted by a host.

| Field | Type | Why |
|---|---|---|
| `name` | `String` | The listing title |
| `description` | `TEXT` | Long description (needs `columnDefinition = "TEXT"`) |
| `city` | `String` | Used for city-based search |
| `address` | `String` | Exact location |
| `pricePerNight` | `Double` | Cost per night |
| `photoUrl` | `String` | Link to a photo (upload handled in Phase 4) |
| `host` | `User` (ManyToOne) | The owner of this listing |
| `createdAt` | `LocalDateTime` | Auto-set via `@PrePersist` |

**Relationship:**
```
User (1) ←── hosts ────→ (Many) Stay
```
`@ManyToOne(fetch = FetchType.LAZY)` — The `host` user data is **only loaded from DB
when you actually access it**, not every time you load a Stay. This is more efficient.

---

### `SlotRequest.java` → table: `slot_requests`

Represents a booking request from a guest who wants to stay at a listing.

| Field | Type | Why |
|---|---|---|
| `guest` | `User` (ManyToOne) | Who is requesting |
| `stay` | `Stay` (ManyToOne) | Which listing they want |
| `startDate` | `LocalDate` | Check-in date |
| `endDate` | `LocalDate` | Check-out date |
| `status` | `String` | Defaults to `"PENDING"`, can be `ACCEPTED` or `REJECTED` |
| `createdAt` | `LocalDateTime` | Auto-set via `@PrePersist` |

**When will you need it?**  
When a guest clicks "Request to Book" on the front-end — a SlotRequest is created.
The host then sees it and can accept or reject it.

---

### `Message.java` → table: `messages`

A direct message between two users.

| Field | Type | Why |
|---|---|---|
| `sender` | `User` (ManyToOne) | Who sent it |
| `receiver` | `User` (ManyToOne) | Who receives it |
| `content` | `TEXT` | The message body |
| `sentAt` | `LocalDateTime` | Auto-set via `@PrePersist` |

**When will you need it?**  
When we build the chat page — the `chatPage.jsx` front-end component will call
message endpoints to load history and send new messages.

---

### `Notification.java` → table: `notifications`

System alerts for a user (e.g., "Your request was accepted!").

| Field | Type | Why |
|---|---|---|
| `user` | `User` (ManyToOne) | Who receives the notification |
| `message` | `String` | The alert text |
| `isRead` | `boolean` | Defaults to `false`; marks if user has seen it |
| `createdAt` | `LocalDateTime` | Auto-set |

**When will you need it?**  
The bell icon (`bell.jsx`) in the front-end navbar will call an endpoint to fetch
unread notifications for the logged-in user.

---

## 5. Repository Layer — Database Access

Repositories are `interface`s that extend `JpaRepository`. Spring automatically
generates all the SQL at runtime — **you write no SQL yourself**.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
```

Spring reads the method name (e.g., `findByEmail`) and writes the SQL:
```sql
SELECT * FROM users WHERE email = ?
```

| Repository | Key Methods | Used For |
|---|---|---|
| `UserRepository` | `findByEmail`, `existsByEmail`, `existsByUsername` | Login, registration, duplicate checks |
| `StayRepository` | `findByCityIgnoreCase`, `findByHostId`, `findByPricePerNightLessThan` | Search & filtering (Phase 4) |
| `MessageRepository` | `findBySenderIdAndReceiverId` | Load chat history between two users |
| `NotificationRepository` | `findByUserIdAndIsReadFalse` | Fetch only unread notifications |
| `SlotRequestRepository` | `findByGuestId`, `findByStayHostId` | "My bookings" and "requests for my listings" |

---

## 6. Security Layer — JWT + Spring Security

### How Authentication Works (The Full Flow)

```
User sends email + password
       ↓
AuthController  →  AuthService
       ↓
AuthenticationManager verifies credentials
       ↓
JwtService generates a signed token
       ↓
Token returned to the user (stored in browser)
       ↓
Every future request sends "Authorization: Bearer <token>"
       ↓
[TODO: JWT Filter] reads token → validates → sets security context
       ↓
Controller handles the request
```

---

### `CustomUserDetailsService.java`

The **bridge between your database and Spring Security**.

Spring Security knows nothing about your `User` entity. This service:
1. Takes an email (Spring calls it "username")
2. Queries your database via `UserRepository`
3. Converts your `User` into Spring's built-in `UserDetails` object

**Why?**  
Spring Security's `AuthenticationManager` needs this to verify passwords during login.

---

### `JwtService.java`

Handles everything related to JWT tokens:

| Method | What it does |
|---|---|
| `generateToken(email)` | Creates a signed token containing the user's email, issued date, and expiry date |
| `extractEmail(token)` | Reads the token and returns whose it is |
| `isTokenValid(token, email)` | Confirms the token belongs to this user AND hasn't expired |
| `isTokenExpired(token)` | Checks the expiry date inside the token |

**Why JWT?**  
The server doesn't store sessions. The token itself **is the proof of identity**.
The server just verifies the cryptographic signature to confirm it's genuine.
This makes the API **stateless** and scales horizontally.

**Token lifetime:** `JWT_EXPIRATION=604800000` ms = **7 days**.

---

### `SecurityConfig.java`

Configures the Spring Security filter chain:

```java
http.csrf(csrf -> csrf.disable());         // Safe for stateless JWT APIs
passwordEncoder() → BCryptPasswordEncoder  // Hashes passwords with BCrypt
authenticationManager() → exposed as Bean  // Used by AuthService to verify login
```

> ⚠️ **Important:** The session management (STATELESS) and route protection rules
> (`/api/auth/**` = public, everything else = authenticated) are currently
> **commented out**. They are waiting for the **JWT Filter** to be implemented first.
> Once the filter is done, uncomment those lines.

**Why BCrypt?**  
BCrypt automatically adds a random "salt" and is intentionally slow — brute-force
attacks take years even if the database leaks.

---

## 7. DTO Layer — Data Transfer Objects

DTOs are simple objects used to carry data **between the HTTP layer and the service layer**.
They protect your entities from being directly exposed to the internet.

| DTO | Fields | Used When |
|---|---|---|
| `RegisterRequest` | `username`, `email`, `password` | User sends sign-up form |
| `LoginRequest` | `email`, `password` | User sends login form |
| `AuthResponse` | `token` | Server replies after successful login or registration |

**Why DTOs instead of sending the Entity directly?**  
If you exposed `User` entity directly, Jackson (the JSON library) would serialize
**all fields including `password`** into the JSON response. DTOs let you control
exactly what goes in and out.

---

## 8. Service Layer — Business Logic

### `AuthService.java`

**Register:**
1. Check if the email is already in the database → throw error if yes
2. Create a `User` object, hash the password with BCrypt
3. Save to the database
4. Generate a JWT token and return it in an `AuthResponse`

**Login:**
1. Call `authenticationManager.authenticate()` — Spring Security automatically:
   - Loads the user from DB via `CustomUserDetailsService`
   - Compares the provided password against the stored BCrypt hash
   - Throws an exception if wrong
2. If successful, generate a new JWT token and return it

---

## 9. Controller Layer — HTTP Endpoints

### `AuthController.java`

| Method | URL | Body | Returns | Who calls it |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | `{ username, email, password }` | `{ token }` | Sign-up page (`sign_in.jsx`) |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token }` | Login page (`log_in.jsx`) |

The controller is intentionally thin — it just receives the request, calls the service,
and returns the response. No business logic lives here.

---

## 10. Dev & Test Utilities

### `UserTester.java` — Startup DB Test

Runs once at startup (implements `CommandLineRunner`):
1. Deletes the old test user if it exists (avoids duplicate errors)
2. Creates a new `User` in memory
3. Saves it to the database
4. Retrieves it back and prints the result

**Why?**  
Used during early development to verify that:
- The DB connection works
- Hibernate created the `users` table correctly
- The JPA repository saves and retrieves data

**When to disable it?**  
Before going to production — remove the `@Component` annotation or delete the class.

---

## 11. What Is Still Pending / Next Steps

### 🔴 Critical: JWT Filter (Next Immediate Step)

A `JwtAuthenticationFilter` class needs to be created. It will:
1. Intercept **every HTTP request**
2. Read the `Authorization: Bearer <token>` header
3. Extract and validate the JWT using `JwtService`
4. Set the authenticated user in Spring's `SecurityContextHolder`

Once done, **uncomment the security rules** in `SecurityConfig.java`:
```java
.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .anyRequest().authenticated()
)
```

---

### 🟡 Planned Features (Entities & Repositories Are Already Ready)

| Feature | What needs to be built | Front-end page waiting for it |
|---|---|---|
| Stay CRUD | `StayController` + `StayService` | `createPost.jsx`, `home.jsx` |
| Slot Booking | `SlotRequestController` + `SlotRequestService` | `slots.jsx`, `slotShow.jsx` |
| Messaging | `MessageController` + `MessageService` | `chatPage.jsx` |
| Notifications | `NotificationController` + `NotificationService` | `bell.jsx` (navbar) |
| Real-time Chat | WebSocket config (`spring-boot-starter-websocket` already in `pom.xml`) | `chatPage.jsx` |
| File Upload | Photo upload endpoint + storage | `createPost.jsx`, `photoSystem.jsx` |
| User Profile | Profile update endpoint | `user.jsx`, `gallery.jsx` |
| Search & Filter | Already have `findByCityIgnoreCase`, `findByPricePerNightLessThan` in `StayRepository` | `searchBar.jsx` |

---

## 12. Full Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        HTTP Request                          │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              Spring Security Filter Chain                    │
│   [TODO: JwtAuthenticationFilter]  →  SecurityConfig         │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                 Controller Layer                             │
│           AuthController  /api/auth/**                       │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer                               │
│                   AuthService                                │
│         (register logic, login logic)                        │
└──────────┬──────────────────────────┬───────────────────────┘
           ↓                          ↓
┌──────────────────────┐   ┌──────────────────────────────────┐
│  Repository Layer    │   │       Security Layer             │
│  UserRepository      │   │  JwtService  (generate/verify)  │
│  StayRepository      │   │  CustomUserDetailsService        │
│  MessageRepository   │   │  BCryptPasswordEncoder           │
│  NotificationRepo    │   └──────────────────────────────────┘
│  SlotRequestRepo     │
└──────────┬───────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                            │
│   users │ stays │ messages │ notifications │ slot_requests   │
└─────────────────────────────────────────────────────────────┘
```

---

*Last updated: March 2026*

