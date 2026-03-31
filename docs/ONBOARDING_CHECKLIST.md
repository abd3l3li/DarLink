# Onboarding checklist

To be used when a new teammate joins DarLink.

## 1) prerequisites

- [ ] repository access
- [ ] Docker + Docker Compose
- [ ] Node.js LTS + npm
- [ ] Java 17 + Maven

## 2) environment

- [ ] read `README.md`
- [ ] create `src/back-end/.env`
- [ ] confirm DB secret file: `src/db/secrets/password.txt`

## 3) start stack

From `src/`:

```bash
make build
make up
```

- [ ] app opens at `https://localhost:1337`
- [ ] API proxy works via `/api/...`

## 4) smoke checks

- [ ] register/login
- [ ] listings page loads
- [ ] create listing works
- [ ] slot request works
- [ ] chat room + message works
- [ ] notifications load

## 5) docs to read

- [ ] `src/front-end/docs/API_OVERVIEW.md`
- [ ] `src/front-end/docs/API_AUTH_USERS.md`
- [ ] `src/front-end/docs/API_LISTINGS_STAYS.md`
- [ ] `src/front-end/docs/API_CHAT_AND_FRIENDS.md`
- [ ] `src/back-end/docs/friend-api-doc.md`

## 6) pre-pr checks

- [ ] frontend lint passes
- [ ] frontend build passes
- [ ] backend tests/build pass
- [ ] docs updated for behavior changes

## done criteria

You’re onboarded when you can run the full app locally, trace one UI action end-to-end, and ship a small passing PR.
