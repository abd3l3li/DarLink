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
- [x] Stay CRUD endpoints available (including paging endpoint GET /api/stays?page=&size=9)
  - `src/main/java/com/DarLink/DarLink/Controller/StayController.java`
- [x] Real-time chat with WebSocket implemented
  - `src/main/java/com/DarLink/DarLink/config/WebSocketConfig.java`
  - `src/main/java/com/DarLink/DarLink/Controller/ChatController.java`
- [x] **Secure routes in `SecurityConfig`**
  - `/api/auth/**` and `/ws/**` are public
  - `GET /api/stays/**` is public (browse without login)
  - Everything else requires a valid JWT
  - File: `src/main/java/com/DarLink/DarLink/config/SecurityConfig.java`
- [x] **SlotRequest booking flow**
  - `SlotRequestController` + `SlotRequestService` fully implemented
  - `POST /api/slot-requests`
  - `GET /api/slot-requests/me`
  - `GET /api/slot-requests/host`
  - `PATCH /api/slot-requests/{id}/status`
- [x] **UserService** — `getMyProfile` + `updateMyProfile` methods implemented
  - `src/main/java/com/DarLink/DarLink/service/UserService.java`

## Not Done (Priority Order)

- [ ] **P1 - Profile endpoints (`/api/users/me`)**
  - `UserController.java` exists but is **empty** — no endpoints wired
  - Need to add:
    - `GET /api/users/me` → calls `userService.getMyProfile(currentUser)`
    - `PATCH /api/users/me` → calls `userService.updateMyProfile(currentUser, request)`
  - File: `src/main/java/com/DarLink/DarLink/Controller/UserController.java`

- [ ] **P2 - Notification endpoints**
  - No `NotificationController` or `NotificationService` exist yet
  - Need to create:
    - `src/main/java/com/DarLink/DarLink/service/NotificationService.java`
    - `src/main/java/com/DarLink/DarLink/Controller/NotificationController.java`
  - Endpoints:
    - `GET /api/notifications`
    - `PATCH /api/notifications/{id}/read`
    - optional: `PATCH /api/notifications/read-all`
  - Ensure users can only read/update their own notifications

## Suggested Execution Order

1. ~~Lock down `SecurityConfig` route protection~~ ✅ Done
2. ~~Implement SlotRequest flow~~ ✅ Done
3. Implement profile endpoints in `UserController` (P1) ← **NEXT**
4. Implement notification endpoints (P2)
