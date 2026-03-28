# DarLink Contributor Onboarding Checklist

This file is a standalone onboarding guide for new contributors.
It does not replace existing docs; it is a practical checklist you can follow on day 1.

## 1) Before You Start

- [ ] You have access to the repository.
- [ ] You can run Docker and Docker Compose locally.
- [ ] You have Java 17, Maven, Node.js, and npm installed (for non-container debugging).
- [ ] You can run HTTPS locally (`https://localhost:1337`).

## 2) Clone and Enter the Project

```bash
cd /path/to/your/workspace
git clone <your-repo-url> DarLink
cd DarLink
```

## 3) Understand the Project Structure

- [ ] Read `README.md` for system overview.
- [ ] Inspect infra entry files:
  - `src/compose.yml`
  - `src/Makefile`
  - `src/nginx/nginx.conf`
- [ ] Inspect backend docs:
  - `src/back-end/docs/API_REFERENCE.md`
  - `src/back-end/docs/JWT.md`
  - `src/back-end/docs/summary.md`
- [ ] Inspect frontend routes in `src/front-end/src/App.jsx`.

## 4) Prepare Environment Files

From repository context, backend expects an env file at `src/back-end/.env`.
Create it with values for your local machine.

- [ ] Create `src/back-end/.env`.
- [ ] Add DB config (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
- [ ] Add JWT config (`JWT_SECRET`, `JWT_EXPIRATION`).
- [ ] Add OAuth config (Google/42 client credentials if needed).

Example (adapt values to your local setup):

```env
DB_URL=jdbc:postgresql://db:5432/DarLink
DB_USERNAME=DarLink
DB_PASSWORD=<your_password>
JWT_SECRET=<long_random_secret>
JWT_EXPIRATION=604800000
SERVER_PORT=8081
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
42_CLIENT_ID=<42_client_id>
42_CLIENT_SECRET=<42_client_secret>
```

## 5) Start Full Stack with Docker Compose

Run from `src/`:

```bash
cd /media/lvillager/ssd/work/DarLink/src
make build
make up
```

- [ ] Containers are up (`make ps`).
- [ ] Nginx listens on `8080` and `8443`.
- [ ] App opens at `https://localhost:8443`.

Useful commands:

```bash
cd /media/lvillager/ssd/work/DarLink/src
make ps
make logs sr=backend
make logs sr=frontend
make logs sr=db
```

## 6) Smoke Test the Main Flows

### Auth

- [ ] Register a user (`POST /api/auth/register`).
- [ ] Login (`POST /api/auth/login`).
- [ ] Save returned JWT token.

### Stays

- [ ] Fetch public stays (`GET /api/stays`).
- [ ] Create stay with JWT (`POST /api/stays/create`).
- [ ] Update and delete your own stay.

### Slot Requests

- [ ] Create request (`POST /api/slot-requests`).
- [ ] View guest requests (`GET /api/slot-requests/me`).
- [ ] View host requests (`GET /api/slot-requests/host`).
- [ ] Update request status (`PATCH /api/slot-requests/{id}/status`).

### User Profile

- [ ] Get current profile (`GET /api/users/me`).
- [ ] Update profile (`PATCH /api/users/me`).

### Chat

- [ ] Create room (`POST /api/rooms?user2Id=...`).
- [ ] Load room messages (`GET /api/rooms/messages?roomId=...`).
- [ ] Validate real-time messaging over `/ws`.

## 7) Security and Auth Verification

- [ ] Confirm protected routes return `401` without token.
- [ ] Confirm public routes still work without token:
  - `/api/auth/**`
  - `GET /api/stays/**`
  - `/ws/**` handshake path
- [ ] Confirm OAuth callback route works in frontend (`/auth/callback`).

## 8) Frontend Development Workflow

If debugging frontend outside Compose:

```bash
cd /media/lvillager/ssd/work/DarLink/src/front-end
npm install
npm run dev
```

- [ ] Verify router pages load:
  - `/`
  - `/slots`
  - `/create-post`
  - `/slot-show/:slotId`
  - `/chat/:ownerId`
  - `/auth/callback`

## 9) Backend Development Workflow

If debugging backend outside Compose:

```bash
cd /media/lvillager/ssd/work/DarLink/src/back-end
mvn spring-boot:run
```

- [ ] Verify startup logs show app boot success.
- [ ] Verify DB connectivity.
- [ ] Verify JWT filter behavior on protected routes.

## 10) Git and PR Checklist

- [ ] Create a feature branch.
- [ ] Keep PR scoped and small.
- [ ] Update docs when endpoints/flows/config change.
- [ ] Include test steps in PR description.
- [ ] Add screenshots or request/response examples for UI/API changes.

PR description template:

```md
## What changed
- 

## Why
- 

## How to test
1. 
2. 
3. 

## Notes
- migrations/config/env updates:
- known limitations:
```

## 11) Common Recovery Steps

If environment is unstable:

```bash
cd /media/lvillager/ssd/work/DarLink/src
make down
make clean
make build
make up
```

If you need a full reset including images:

```bash
cd /media/lvillager/ssd/work/DarLink/src
make fclean
make build
make up
```

## 12) First-Day Success Criteria

You are fully onboarded when all are true:

- [ ] App loads via `https://localhost:8443`.
- [ ] You can register/login and receive JWT.
- [ ] You can create a stay and a slot request.
- [ ] You can access protected endpoints with token.
- [ ] You can create a chat room and exchange a real-time message.
- [ ] You can explain service routing (`nginx -> frontend/backend -> db`).

---

If this checklist drifts from implementation, update this file and the root `README.md` in the same PR.
