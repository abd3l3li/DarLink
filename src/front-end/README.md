# Frontend (`src/front-end`)

This package contains the DarLink web app.

## Stack

- React + Vite
- React Router
- Tailwind CSS

## What it covers

- authentication pages (login/signup/oauth callback/2FA)
- listings and listing details
- create listing flow
- slot request flow
- chat UI and social actions
- notification dropdown/context

## Local development

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```

## API contracts

Detailed expected API behavior lives in `docs/`:

- `API_OVERVIEW.md`
- `API_AUTH_USERS.md`
- `API_LISTINGS_STAYS.md`
- `API_SLOT_REQUESTS.md`
- `API_CHAT_AND_FRIENDS.md`
- `API_NOTIFICATIONS.md`
- `API_UPLOADS.md`
- `2fa-test.md`

Use these docs as the source of truth for frontend ↔ backend integration.
