# DarLink

DarLink is a full-stack roommate and stay-matching platform. Users can browse listings, create stays as hosts, send booking requests, and chat in real time. The repository includes a containerized frontend, backend, reverse proxy, and PostgreSQL database.

This README is intentionally detailed so a new teammate can understand the system, run it locally, and contribute without hunting through multiple files.

## Table of Contents

- [1) What This Project Does](#1-what-this-project-does)
- [2) Repository Layout](#2-repository-layout)
- [3) System Architecture](#3-system-architecture)
- [4) Tech Stack](#4-tech-stack)
- [5) Core User Flows](#5-core-user-flows)
- [6) Service and Port Mapping](#6-service-and-port-mapping)
- [7) Configuration and Secrets](#7-configuration-and-secrets)
- [8) Local Development (Docker Compose)](#8-local-development-docker-compose)
- [9) Running Individual Services (Without Compose)](#9-running-individual-services-without-compose)
- [10) API Surface (Backend)](#10-api-surface-backend)
- [11) Frontend Routes](#11-frontend-routes)
- [12) Authentication and Security Model](#12-authentication-and-security-model)
- [13) Real-Time Messaging (WebSocket/STOMP)](#13-real-time-messaging-websocketstomp)
- [14) Data Model](#14-data-model)
- [15) Common Development Tasks](#15-common-development-tasks)
- [16) Troubleshooting Guide](#16-troubleshooting-guide)
- [17) Current Status and Known Gaps](#17-current-status-and-known-gaps)
- [18) Contribution Guide](#18-contribution-guide)

## 1) What This Project Does

DarLink focuses on three main product areas:

1. Listing discovery and hosting
   - Guests browse available stays.
   - Hosts create, update, and delete their own stay listings.
2. Booking workflow
   - Guests send slot (booking) requests to hosts.
   - Hosts review and change request status.
3. Real-time chat
   - Users create chat rooms.
   - Message exchange happens through REST + WebSocket.

It also supports classic email/password auth, JWT-based stateless auth, and OAuth2 login providers (Google + 42).

## 2) Repository Layout

Top-level:

- `README.md`: this file.
- `src/`: all service code and infrastructure files.

Inside `src/`:

- `compose.yml`: orchestrates `nginx`, `front-end`, `back-end`, `db`.
- `Makefile`: helper targets for compose lifecycle.
- `nginx/`: reverse proxy config and SSL cert/key for local HTTPS.
- `db/`: PostgreSQL image and secret password file.
- `back-end/`: Spring Boot API + docs.
- `front-end/`: Vite/React UI.

Backend key folders:

- `src/back-end/src/main/java/com/DarLink/DarLink/Controller`: HTTP + message controllers.
- `src/back-end/src/main/java/com/DarLink/DarLink/service`: business logic.
- `src/back-end/src/main/java/com/DarLink/DarLink/security`: JWT/OAuth2 security pieces.
- `src/back-end/src/main/resources/application.properties`: app runtime configuration.
- `src/back-end/docs/`: detailed backend docs and API reference.

Frontend key folders:

- `src/front-end/src/pages`: app pages (`home`, `slots`, `chat`, auth pages, etc.).
- `src/front-end/src/components`: layout, UI primitives, and feature components.
- `src/front-end/src/App.jsx`: route definitions.

## 3) System Architecture

High-level flow:

1. Browser hits `https://localhost:8443`.
2. Nginx serves as entrypoint and reverse proxy.
3. Requests are routed by path:
   - `/` -> frontend Vite app (`frontend:5173`)
   - `/api/*` -> Spring backend (`backend:8081`)
   - `/oauth2/*` and `/login/*` -> backend OAuth endpoints
   - `/ws/*` -> backend WebSocket endpoint
4. Backend reads/writes PostgreSQL (`db:5432`).

Design characteristics:

- Container-per-concern architecture.
- Isolated Docker network (`darlink`).
- Persistent database volume (`db-data`).
- TLS termination at Nginx for local HTTPS testing.

## 4) Tech Stack

Frontend (`src/front-end/package.json`):

- React `19.x`.
- React Router `7.x`.
- Vite `7.x`.
- Tailwind CSS `4.x`.
- Chakra UI and related UI dependencies.

Backend (`src/back-end/pom.xml`):

- Java 17 (project property) with Spring Boot `3.5.11`.
- Spring Data JPA (ORM).
- Spring Security.
- Spring Web + Validation.
- Spring WebSocket.
- Spring OAuth2 client.
- JWT with `jjwt` `0.12.5`.
- PostgreSQL JDBC driver.
- Lombok.

Infra:

- Docker + Docker Compose.
- Nginx Alpine image.
- PostgreSQL 18 image (via custom `db/Dockerfile`).

## 5) Core User Flows

Auth:

- Register/login returns JWT token.
- Token is sent in `Authorization: Bearer <token>` for protected endpoints.
- OAuth2 login redirects back to frontend callback with token query param.

Stay lifecycle:

- Public users can list/browse stays.
- Authenticated host creates stay (`POST /api/stays/create`).
- Host can update/delete only own stays.

Slot request lifecycle:

- Guest creates request for a stay.
- Guest views own requests.
- Host views requests on host-owned stays.
- Host updates status (`ACCEPTED`, `REJECTED`, `CANCELLED`).

Chat lifecycle:

- User creates room with another user.
- Both users can fetch room metadata and history.
- Real-time messages are published to `/topic/room.{roomId}`.

## 6) Service and Port Mapping

From `src/compose.yml` + `src/nginx/nginx.conf`:

- External ports:
  - `8080`: HTTP (redirects to HTTPS)
  - `1337`: HTTPS public entrypoint
- Internal services:
  - `frontend`: Vite dev server on `5173` (proxied)
  - `backend`: Spring app on `8081` (proxied)
  - `db`: PostgreSQL on `5432` (internal network)

User-facing URLs:

- App UI: `https://localhost:8443/`
- API through proxy: `https://localhost:8443/api/...`
- OAuth2 callback endpoint (backend): `/login/oauth2/code/{provider}`

## 7) Configuration and Secrets

Backend reads runtime values from env variables (`application.properties`):

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `SERVER_PORT` (defaults to `8080` if missing)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `42_CLIENT_ID`
- `42_CLIENT_SECRET`

Docker secrets:

- DB password file: `src/db/secrets/password.txt`
- Mounted into containers via compose secret `db-password`

Important notes:

- Backend compose service expects env file at `src/back-end/.env`.
- Keep real credentials out of git.
- Current `application.properties` has debug security logging enabled.

## 8) Local Development (Docker Compose)

All commands below are run from `src/`.

Quick start:

```bash
cd /DarLink/src
make build
make up
```

Common lifecycle commands:

```bash
cd /DarLink/src
make up-d
make ps
make logs SERVICE=backend
make down
make clean
```

Equivalent direct compose commands:

```bash
cd /DarLink/src
docker compose up --build
docker compose up -d
docker compose ps -a
docker compose logs backend
docker compose down
```

## 9) Running Individual Services (Without Compose)

Frontend (from `src/front-end`):

```bash
npm install
npm run dev
```

Backend (from `src/back-end`):

```bash
mvn spring-boot:run
```

Use this mode when debugging one service deeply, but compose is recommended for full-stack integration.

## 10) API Surface (Backend)

Primary route groups currently implemented:

- Auth: `/api/auth/*`
  - `POST /register`
  - `POST /login`
- Users: `/api/users/*`
  - `GET /me`
  - `PATCH /me`
- Stays: `/api/stays/*`
  - `GET /`
  - `GET /{id}`
  - `GET /page?page=N`
  - `POST /create`
  - `PUT /{id}`
  - `DELETE /{id}`
- Slot requests: `/api/slot-requests/*`
  - `POST /`
  - `GET /me`
  - `GET /host`
  - `PATCH /{id}/status`
- Chat rooms/messages:
  - `POST /api/rooms?user2Id=...`
  - `GET /api/rooms/between?user2Id=...`
  - `GET /api/rooms/messages?roomId=...`
  - `GET /api/rooms`

Detailed request/response examples live in `src/back-end/docs/API_REFERENCE.md`.

## 11) Frontend Routes

From `src/front-end/src/App.jsx`:

- `/`
- `/slots`
- `/create-post`
- `/slot-show/:slotId`
- `/about`
- `/chat/:ownerId`
- `/chat/:ownerId/:stayId`
- `/sign-up`
- `/log-in`
- `/auth/callback`

Routing is browser-based via React Router.

## 12) Authentication and Security Model

JWT:

- Generated during register/login and after OAuth2 success.
- Backend uses `JwtAuthenticationFilter` to parse and validate bearer token.
- Security is configured stateless (`SessionCreationPolicy.STATELESS`).

Route access policy (`SecurityConfig`):

- Public:
  - `/api/auth/**`
  - `/ws/**`
  - `GET /api/stays/**`
- Protected:
  - all other routes

OAuth2:

- Providers configured: Google and 42.
- Success handler creates/fetches local user and redirects frontend to:
  - `https://localhost:8443/auth/callback?token=<jwt>`

## 13) Real-Time Messaging (WebSocket/STOMP)

Backend WebSocket config:

- STOMP endpoint: `/ws` (SockJS enabled)
- App destination prefix: `/app`
- Broker topic prefix: `/topic`

Messaging behavior:

- Clients connect with JWT in STOMP `Authorization` header.
- Send chat payload to `/app/chat/{roomId}`.
- Subscribe to `/topic/room.{roomId}` for live messages.
- Per-user notifications use `/topic/user.{userId}`.

## 14) Data Model

Main entities in backend:

- `User`
- `Stay`
- `SlotRequest`
- `ChatRoom`
- `Message`
- `Notification`

Storage:

- PostgreSQL database `DarLink`.
- Hibernate schema management in dev via `spring.jpa.hibernate.ddl-auto=update`.
- SQL logging currently enabled (`spring.jpa.show-sql=true`).

## 15) Common Development Tasks

Rebuild and restart all services:

```bash
cd /media/lvillager/ssd/work/DarLink/src
make down
make build
make up
```

Inspect service logs:

```bash
cd /DarLink/src
make logs SERVICE=frontend
make logs SERVICE=backend
make logs SERVICE=db
```

Cleanup all volumes and images (destructive):

```bash
cd /DarLink/src
make fclean
```

## 16) Troubleshooting Guide

1. Browser shows certificate warning on `https://localhost:8443`
   - Expected when using local self-signed certs in `src/nginx/ssl`.

2. API returns `401 Unauthorized`
   - Ensure bearer token is present and not expired.
   - Confirm protected route policy in `src/back-end/src/main/java/com/DarLink/DarLink/config/SecurityConfig.java`.

3. OAuth redirect works but frontend is not authenticated
   - Check `AuthCallback` route exists (`/auth/callback`).
   - Verify token query param parsing and storage in frontend page logic.

4. WebSocket connection established but no messages received
   - Confirm subscription to exact room topic (`/topic/room.{id}`).
   - Ensure STOMP connect headers include `Authorization: Bearer ...`.

5. Backend cannot connect to DB
   - Validate `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` values.
   - Confirm db service is healthy in compose.

## 17) Current Status and Known Gaps

Observed status from repository docs/code:

- Core auth, stays, slot requests, and chat are implemented.
- Profile endpoints are present in `UserController`.
- Backend docs are rich and mostly up-to-date.

Potential gaps to keep in mind:

- Some documentation files in `src/front-end/docs/` describe older scaffold examples.
- `src/back-end/Dockerfile` currently includes a non-standard `Copy` instruction spelling that may require correction to `COPY`.
- Debug logging and verbose SQL output are enabled; tune before production.

## 18) Contribution Guide

Recommended workflow:

1. Create a feature branch.
2. Keep changes scoped (frontend, backend, or infra).
3. Update docs when behavior or routes change.
4. Run service startup checks with compose.
5. Open PR with:
   - what changed,
   - why,
   - how to test,
   - any migration/config impacts.

Suggested doc update points when adding features:

- Root `README.md` for architecture/setup changes.
- `src/back-end/docs/API_REFERENCE.md` for endpoint changes.
- `src/back-end/docs/JWT.md` if auth flow changes.

---

If you want, I can also generate:

1. A matching `src/back-end/.env.example` template.
2. A quick architecture diagram (Mermaid) embedded in this README.
3. A contributor onboarding checklist with first-day tasks.
