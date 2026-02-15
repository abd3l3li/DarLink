# SplitStay Setup Guide (Vite + React JS + Tailwind)

## 0) Prerequisites

- Node.js installed (modern LTS recommended)
- npm installed

Check versions:

```bash
node -v
npm -v
```

## 1) Create project (React + JavaScript)

```bash
npm create vite@latest splitstay -- --template react
cd splitstay
npm install
```

## 2) Install dependencies

```bash
npm i react-router-dom
npm i tailwindcss @tailwindcss/vite
npm i -D eslint prettier
```

## 3) Remove Vite template demo files

Delete these files:

- `src/assets/react.svg`
- `src/App.css`

You will replace:

- `src/main.jsx`
- `src/App.jsx`
- `src/index.css`

## 4) Configure Vite (vite.config.js)

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});
```

## 5) Configure global styles (src/index.css)

```css
@import "tailwindcss";

/* Design Tokens */
:root {
  --color-primary: ;
  --color-secondary: ;
  --color-bg: ;
  --color-surface: ;
  --color-text: ;
  --color-muted: ;
}

html,
body,
#root {
  height: 100%;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

## 6) Recommended folder structure

```
DarLink/
├─ backend/
│  ├─ README.md
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ server.js
│  │  └─ routes/
│  │     ├─ stays.routes.js
│  │     ├─ slotRequests.routes.js
│  │     ├─ messages.routes.js
│  │     └─ users.routes.js
│  ├─ package.json
│  └─ .env.example
│
├─ src/
│  ├─ app/
│  │  └─ router.jsx
│  ├─ components/
│  │  ├─ layout/
│  │  │  └─ Navbar.jsx
│  │  ├─ stays/
│  │  ├─ chat/
│  │  └─ ui/
│  ├─ pages/
│  │  ├─ HomePage.jsx
│  │  ├─ LoginPage.jsx
│  │  ├─ RegisterPage.jsx
│  │  ├─ StayDetailsPage.jsx
│  │  ├─ ProfilePage.jsx
│  │  ├─ MessagesPage.jsx
│  │  ├─ NotificationsPage.jsx
│  │  ├─ SettingsPage.jsx
│  │  └─ ApiDocsPage.jsx
│  ├─ lib/
│  │  ├─ api.js
│  │  ├─ mockData.js
│  │  └─ utils.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
│
├─ docs/
│  └─ setup.md
├─ .env.example
├─ index.html
├─ package.json
└─ vite.config.js
```

## 7) Router config (src/app/router.jsx)

```jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import StayDetailsPage from "../pages/StayDetailsPage";
import ProfilePage from "../pages/ProfilePage";
import MessagesPage from "../pages/MessagesPage";
import NotificationsPage from "../pages/NotificationsPage";
import SettingsPage from "../pages/SettingsPage";
import ApiDocsPage from "../pages/ApiDocsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "stays/:id", element: <StayDetailsPage /> },
      { path: "profile/:id", element: <ProfilePage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "api-docs", element: <ApiDocsPage /> },
    ],
  },
]);
```

## 8) Main entry (src/main.jsx)

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

## 9) App layout (src/App.jsx)

```jsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
```

## 10) Backend placeholder (backend/README.md)

```md
# DarLink Backend (Placeholder)

This folder is reserved for backend API work later.

Planned stack:
- Node.js
- Express
- PostgreSQL

Planned base path:
- /api/v1

First endpoints:
- GET /api/v1/stays
- GET /api/v1/stays/:id
- POST /api/v1/stays
- POST /api/v1/slot-requests
- POST /api/v1/messages
```

## 11) Environment example (.env.example)

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_DEFAULT_LANG=en
VITE_ENABLE_RTL=false
```

## 12) Run commands

Start development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 13) Suggested first Git commits

```bash
git init
git add .
git commit -m "init: scaffold with Vite React JS"
git commit -m "setup: add Tailwind and React Router"
git commit -m "chore: add app structure and backend placeholder"
```

## 14) Common issues and fixes

### Tailwind classes not applying
- Ensure `vite.config.js` includes `tailwindcss()` in plugins
- Ensure `src/index.css` has `@import "tailwindcss";`
- Restart dev server after config changes

### @/... alias not working
- Ensure alias exists in `vite.config.js`
- Restart dev server

### Port already used

```bash
npm run dev -- --port 5174
```

---

## Quick Start Checklist

For quick setup in future sessions:

- [ ] `npm create vite@latest DarLink -- --template react`
- [ ] `cd DarLink && npm install`
- [ ] `npm i react-router-dom tailwindcss @tailwindcss/vite`
- [ ] Delete: `src/assets/react.svg`, `src/App.css`
- [ ] Update: `vite.config.js`, `src/index.css`, `src/main.jsx`, `src/App.jsx`
- [ ] Create: `src/app/router.jsx`
- [ ] Create folder structure: `pages/`, `components/`, `lib/`, `backend/`
- [ ] `npm run dev`