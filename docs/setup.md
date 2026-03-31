# Frontend setup guide

This guide is for running the existing DarLink frontend locally.

## prerequisites

- Node.js LTS
- npm

## install

From `src/front-end/`:

```bash
npm install
```

## run

```bash
npm run dev
```

Default dev URL is shown by Vite in terminal output.

## quality commands

```bash
npm run lint
npm run build
```

## environment and API base

- in Docker mode, frontend traffic is usually proxied through `https://localhost:1337`
- API requests should target `/api/...` through the same origin when proxy is available

## key folders

- `src/pages/` → route pages
- `src/components/` → reusable UI and feature components
- `src/lib/` → API wrappers and shared helpers
- `docs/` → frontend API contracts and integration notes

## common issues

### dependency install fails

- delete `node_modules` and lockfile, then reinstall

### API calls fail in local mode

- verify backend is running
- verify proxy/API base URL settings

### build passes but runtime fails

- check browser console for route or env mismatch
- verify expected endpoints in `docs/API_OVERVIEW.md`