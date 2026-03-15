# DarLink Backend TODO (Current Status)

Updated: 2026-03-15

## Done

- [x] Docker + DB setup
  - `Dockerfile` exists
  - DB config is environment-based in `src/main/resources/application.properties`
- [x] Database entities/tables designed
  - Entities exist for `User`, `Stay`, `SlotRequest`, `Message`, `Notification`, `ChatRoom`
- [x] Repositories ready
  - Repositories exist under `src/main/java/com/DarLink/DarLink/repository`
- [x] Register/Login API endpoints working
  - `src/main/java/com/DarLink/DarLink/Controller/AuthController.java`
- [x] JWT token generation and validation
  - `src/main/java/com/DarLink/DarLink/service/AuthService.java`
  - `src/main/java/com/DarLink/DarLink/security/JwtAuthenticationFilter.java`
- [x] Stay CRUD endpoints available (including paging endpoint)
  - `src/main/java/com/DarLink/DarLink/Controller/StayController.java`
- [x] Real-time chat with WebSocket implemented
  - `src/main/java/com/DarLink/DarLink/config/WebSocketConfig.java`
  - `src/main/java/com/DarLink/DarLink/Controller/ChatController.java`

## Not Done (Priority Order)

- [ ] **P0 - Secure routes in `SecurityConfig`**
  - Problem now: `requestMatchers("/api/**").permitAll()` keeps business APIs open
  - Target: keep only auth + handshake public, require JWT for protected API routes
  - File: `src/main/java/com/DarLink/DarLink/config/SecurityConfig.java`

- [ ] **P1 - SlotRequest booking flow**
  - Add `SlotRequestController` + `SlotRequestService`
  - Endpoints:
    - `POST /api/slot-requests`
    - `GET /api/slot-requests/me`
    - `GET /api/slot-requests/host`
    - `PATCH /api/slot-requests/{id}/status`
  - Rules:
    - validate dates (`start < end`, not in past)
    - guest cannot request own stay
    - only host can update request status

- [ ] **P1 - Profile endpoints (`/api/users/me`)**
  - Add `UserController` methods:
    - `GET /api/users/me`
    - `PATCH /api/users/me`
  - Support profile fields: `bio`, `city`, `avatarUrl`
  - Scope updates to authenticated user only

- [ ] **P2 - Notification endpoints**
  - Add `NotificationController` + `NotificationService`
  - Endpoints:
    - `GET /api/notifications`
    - `PATCH /api/notifications/{id}/read`
    - optional: `PATCH /api/notifications/read-all`
  - Ensure users can only read/update their own notifications

## Suggested Execution Order

1. Lock down `SecurityConfig` route protection (P0)
2. Implement SlotRequest flow (P1)
3. Implement profile endpoints (P1)
4. Implement notification endpoints (P2)

