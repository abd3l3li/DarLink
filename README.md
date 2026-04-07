*This project has been created as part of the 42 curriculum by abel-baz, a-ait-bo, her-rehy, ysahraou, rboulaga.*

# DarLink

## Description

**Project name:** DarLink

DarLink is a full-stack roommate/stay platform.

### Goal

Build a practical web platform where users can discover stays, request slots, and communicate in real time.

### Key features

- authentication (email/password, OAuth2, optional 2FA)
- listings and booking workflow
- real-time chat and notifications
- friendship/request states in social flows

## Instructions

### Prerequisites

- Docker + Docker Compose
- GNU Make
- (optional local dev) Node.js LTS + npm, Java 17 + Maven
- backend environment file: `src/back-end/.env`
- DB password secret: `src/db/secrets/password.txt`

### Install and run (recommended)

DarLink uses **Docker through the Makefile** in `src/`.

```bash
cd src
make build
make up
```

Open:

- app: `https://localhost:1337`
- api: `https://localhost:1337/api/...`

### Common lifecycle commands

```bash
cd src
make up-d
make ps
make logs SERVICE=backend
make down
```

### Optional local service runs

Frontend:

```bash
cd src/front-end
npm install
npm run dev
```

Backend:

```bash
cd src/back-end
mvn spring-boot:run
```

## Team Information

| Member | Assigned role(s)             | Responsibilities |
|---|------------------------------|---|
| `abel-baz` | Tech Lead, Frontend Developer | Technical direction, frontend architecture, UI implementation, and design system alignment. |
| `a-ait-bo` | PM, Frontend Developer       | Planning/scheduling, frontend implementation, and delivery coordination. |
| `her-rehy` | PO, Backend Developer        | Product requirement ownership, backend implementation, and feature priority alignment. |
| `ysahraou` | Backend Developer            | Backend (WebSocket, Notifications, OAuth2), Makefile, and Docker Compose layout. |
| `rboulaga` | DevOps Engineer              | DevOps implementation, backup system, and health check integration. |

## Project Management

- **Work organization:** split by domain ownership (frontend, backend, devops) with regular integration checkpoints.
- **Task distribution:** frontend (`abel-baz`, `a-ait-bo`), backend (`her-rehy`, `ysahraou`), devops (`rboulaga`).
- **Coordination cadence:** iterative cycles with shared review and merge phases.
- **Tools used:** Git + GitHub repository, markdown-based project notes/checklists.
- **Communication channels:** team chat and repository discussions.

## Technical Stack

### Frontend

- React, Vite, React Router, Tailwind CSS

### Backend

- Java 17, Spring Boot, Spring Security, JPA, WebSocket/STOMP, OAuth2

### Database

- PostgreSQL

### Other significant technologies

- Docker Compose
- Nginx reverse proxy
- JWT authentication

### Major technical choices and justification

- **Spring Boot:** fast and robust for REST + security + WebSocket in one backend.
- **React + Vite:** fast iteration and simple component-based UI development.
- **PostgreSQL:** reliable relational model for users, stays, requests, and chat entities.
- **Docker + Makefile:** reproducible local environments with simple `make` commands.

## Database Schema

### Main entities

- `User`
- `Stay`
- `SlotRequest`
- `ChatRoom`
- `Message`
- `Notification`
- friend/request entities for social relationships

### Relationship overview

- one `User` can own many `Stay`
- one `Stay` can have many `SlotRequest`
- one `ChatRoom` contains many `Message`
- one `User` can receive many `Notification`
- friendship/request tables link two users with status transitions

### Key field examples

- `id` (primary keys)
- user identity fields (`username`, `email`)
- stay fields (`city`, `pricePerNight`, `description`)
- request fields (`status`, `startDate`, `endDate`)
- message fields (`content`, `sentAt`, `senderId`, `roomId`)

## Features List

| Feature | Description | Implemented by |
|---|---|---|
| Authentication | Register/login with JWT, OAuth2 callbacks, 2FA support paths | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Listings | Create, browse, update, delete stays | `abel-baz`, `a-ait-bo`, `her-rehy`, `ysahraou` |
| Slot requests | Guest request + host decision workflow | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Chat | Room creation, history fetch, real-time messaging | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Notifications | Notification feed and badge/update flows | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Social/Friends | Friend request state transitions and actions | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |

## Modules

> Module naming below follows the project activity requirement format.

| Module | Type | Points | Why chosen | Implementation summary | Implemented by |
|---|---:|---:|---|---|---|
| Use a framework for both frontend and backend | Major | 2 | Strong structure and maintainability for full-stack development | React (frontend) + Spring Boot (backend) architecture | `abel-baz`, `a-ait-bo`, `her-rehy`, `ysahraou`, `rboulaga` |
| Implement real-time features | Major | 2 | Core collaborative user experience | WebSocket/STOMP live chat and real-time updates | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Allow users to interact with other users | Major | 2 | Social core of the platform | Chat, profile actions, and friends system | `abel-baz`, `a-ait-bo`, `her-rehy`, `ysahraou`, `rboulaga` |
| Standard user management | Major | 2 | Mandatory user lifecycle and profile handling | Profiles, avatar/user data, friend status and account flows | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Custom Major Module: integrated social booking platform | Major | 2 | High-complexity domain integration across multiple subsystems | End-to-end flow linking listings, slot requests, chat, notifications, and friendship states | `abel-baz`, `a-ait-bo`, `her-rehy`, `ysahraou`, `rboulaga` |
| Use an ORM | Minor | 1 | Type-safe data access and maintainable DB layer | JPA/Hibernate-based entity modeling and persistence | `her-rehy`, `ysahraou` |
| Notification system | Minor | 1 | Better responsiveness and user awareness | Creation/update/deletion-triggered notification flows and unread behavior | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Custom-made design system | Minor | 1 | Consistent and reusable UI/UX | Shared components, styling rules, and reusable interface patterns | `abel-baz`, `a-ait-bo` |
| Advanced search functionality | Minor | 1 | Better discovery and filtering experience | Listing filters, query-based search, and pagination/search behavior | `abel-baz`, `a-ait-bo`, `her-rehy`, `ysahraou` |
| File upload and management | Minor | 1 | Required media workflow for listing quality | Image validation, secure upload paths, preview, and management hooks | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| Support for additional browsers | Minor | 1 | Better compatibility and evaluation coverage | Cross-browser behavior support beyond default browser | `abel-baz`, `a-ait-bo` |
| Remote authentication | Minor | 1 | Easier login and modern auth experience | OAuth2 provider integration and callback handling | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo` |
| 2FA system | Minor | 1 | Stronger account security | TOTP-based two-factor authentication setup and verification flow | `her-rehy`, `ysahraou`, `abel-baz`, `a-ait-bo`, `rboulaga` |
| Health check & status page | Minor | 1 | Reliability and operational visibility | Service status/health visibility with backup/disaster-recovery awareness | `rboulaga` |

**Total points:** 19 / 14 required

## Individual Contributions

### `abel-baz`

- acted as tech lead for frontend technical direction and integration decisions.
- created reusable frontend components and key user-facing flows.
- designed the UI in Figma, including branding decisions: https://www.figma.com/design/QwLsyUAuPn2P0d5PjI16Cj/DarLink?node-id=0-1&p=f&t=SMCrYXnzZdjIyIZC-0
- defined visual identity assets (color palette and logo).

### `a-ait-bo`

- implemented frontend features and UI interaction behavior.
- contributed to frontend routing and integration polish.
- acted as project manager (PM) for planning and team coordination.

### `her-rehy`

- implemented backend endpoints and business logic.
- worked on authentication/security-related backend paths.
- acted as product owner (PO) for requirement alignment and prioritization.

### `ysahraou`

- implemented the chatapp backend with WebSocket/STOMP.
- developed the notification backend system.
- integrated OAuth2 authentication (Google, 42).
- created and maintained the project's Makefile and Docker Compose layout.

### `rboulaga`

- handled all DevOps implementation, including container orchestration and environment setup.
- developed the database backup and restoration system (Makefile/scripts).
- implemented the health check and status monitoring system for service reliability.

### Challenges and resolutions

- **Challenge:** keeping frontend contracts aligned with backend evolution.
	**Resolution:** dedicated API docs + explicit mapping sections.
- **Challenge:** secure auth while preserving DX.
	**Resolution:** JWT + route-level protections + planned 2FA flow.

## Resources

### Classic references

- Figma design file (DarLink UI/branding): https://www.figma.com/design/QwLsyUAuPn2P0d5PjI16Cj/DarLink?node-id=0-1&p=f&t=SMCrYXnzZdjIyIZC-0
- Spring Boot Documentation: https://docs.spring.io/spring-boot/docs/current/reference/html/
- Spring Security Documentation: https://docs.spring.io/spring-security/reference/
- React Documentation: https://react.dev/
- Vite Documentation: https://vite.dev/guide/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Docker Documentation: https://docs.docker.com/
- Nginx Documentation: https://nginx.org/en/docs/

### AI usage disclosure

AI assistance was used for:

- refactoring documentation formatting,
- generating concise API documentation drafts,
- wording improvements and structure checks.

AI was **not** used as a blind replacement for implementation decisions; outputs were reviewed and adjusted to match the repository’s actual behavior.

## Additional information

### Repository layout

- `src/compose.yml` → full local stack
- `src/front-end/` → web app
- `src/back-end/` → API
- `src/db/` → database image and secrets
- `src/Makefile` → helper commands

### Documentation map

- `ONBOARDING_CHECKLIST.md`
- `plan-twoFactorAuthenticationImplementation.prompt.md`
- `src/front-end/docs/`