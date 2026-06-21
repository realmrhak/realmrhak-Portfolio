# Haroon Ameer Khan — 3D Portfolio (MERN Stack)

A modern, animated personal portfolio website built as a full **MERN stack**
(**M**ongoDB + **E**xpress + **R**eact + **N**ode.js) using **JavaScript**.

> Originally adapted from Rifqi Muhammad Aliya's Next.js + Supabase portfolio at
> <https://github.com/RifqiMuhammadAliya12/portofoliov1.git>, then fully
> rebranded, hardened, and rebuilt as a MERN stack portfolio for
> **Haroon Ameer Khan**.

This README is the **single source of truth** for the project: it contains the
Product Requirements Document (PRD), Technical Requirements Document (TRD),
setup, deployment, security notes, and the full list of fixes applied to the
original repo.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start (Local)](#quick-start-local)
5. [Environment Variables](#environment-variables)
6. [Deployment](#deployment)
7. [Product Requirements Document (PRD)](#product-requirements-document-prd)
8. [Technical Requirements Document (TRD)](#technical-requirements-document-trd)
9. [Security](#security)
10. [Performance](#performance)
11. [Bugs Fixed From Original](#bugs-fixed-from-original)
12. [API Reference](#api-reference)

---

## Overview

A two-part web application:

- **Frontend** — React + Vite single-page app, deployed to **Vercel**.
  - **Public site:** animated hero with a 3D draggable card (three.js + rapier
    physics), About section, Resume / Experience timeline, Portfolio tabs
    (projects / certificates / tech stack), Contact form, and visitor Comments
    with image uploads and likes.
  - **Admin panel:** JWT-protected dashboard with full CRUD for projects,
    certificates, tech stack, comments (pin/unpin/delete), and contact messages
    (mark read / reply / delete).
- **Backend** — Node.js + Express + MongoDB (Mongoose), deployed to **Render**.
  - REST API with JWT auth, role-based route protection (`admin` only),
    rate limiting (global / auth / write), input sanitization (sanitize-html),
    file upload with magic-byte verification, Helmet security headers, and
    gzip compression.

The 3D hero card animation from the original Next.js portfolio is preserved,
but the Supabase dependency has been completely replaced by a self-hosted
Express + MongoDB backend. All content is rebranded for
**Haroon Ameer Khan** (Full-Stack Developer, MERN).

---

## Tech Stack

| Layer       | Technology                                                            |
| ----------- | -------------------------------------------------------------------- |
| Frontend    | React 18, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion 11   |
| 3D          | three.js, @react-three/fiber, @react-three/drei, @react-three/rapier |
| Backend     | Node.js 18+, Express 4, Mongoose 8                                   |
| Database    | MongoDB 6+ (Atlas recommended)                                       |
| Auth        | JWT (jsonwebtoken, HS256) + bcryptjs (cost factor 12)                |
| Uploads     | Multer (disk → Cloudinary, magic-byte verified) — Cloudinary required for Render free tier |
| Security    | Helmet, CORS allowlist, express-rate-limit, sanitize-html            |
| Deployment  | Vercel (frontend) + Render (backend) + MongoDB Atlas (database)      |

---

## Project Structure

```
3D-Portfolio/
├── README.md                  ← you are here (PRD + TRD)
├── vercel.json                ← Vercel deployment config (frontend)
├── render.yaml                ← Render Blueprint (backend)
├── .gitignore
│
├── backend/                   ← Node.js + Express + MongoDB
│   ├── server.js              ← entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js              ← Mongoose connection (listeners registered before connect)
│   ├── models/
│   │   ├── User.js            ← admin user (bcrypt-hashed, pre-save + pre-findOneAndUpdate hooks)
│   │   ├── Project.js
│   │   ├── Certificate.js
│   │   ├── TechStack.js
│   │   ├── Comment.js         ← likedBy[] hashed fingerprints, atomic $addToSet
│   │   └── Message.js         ← contact form submissions
│   ├── controllers/           ← all updates use whitelisted-field mass-assign protection
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── certificateController.js
│   │   ├── techController.js
│   │   ├── commentController.js
│   │   ├── messageController.js
│   │   └── dashboardController.js
│   ├── routes/                ← all admin routes use protect + restrictTo('admin')
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── certificates.js
│   │   ├── tech.js
│   │   ├── comments.js
│   │   ├── messages.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   ├── auth.js            ← JWT verify (HS256 pinned), restrictTo
│   │   ├── upload.js          ← Multer + magic-byte verification + auto-create uploads dir
│   │   ├── sanitize.js        ← stripHtml + truncate helpers
│   │   ├── rateLimiter.js     ← apiLimiter / authLimiter / writeLimiter
│   │   └── errorHandler.js    ← no internal message leak in production
│   ├── uploads/               ← runtime-uploaded images (gitignored except .gitkeep)
│   └── utils/
│       └── seed.js            ← idempotent seed (no plaintext password logging)
│
└── frontend/                  ← React + Vite single-page app
    ├── index.html             ← preconnect, OG/Twitter meta, font preload
    ├── package.json
    ├── vite.config.js         ← manualChunks (three/react/motion/swal/markdown), terser drop_console
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── .env.production.example
    ├── public/
    │   └── assets/            ← favicon, haroon.png, haroon-profile.png, kartu.glb, bandd.png
    └── src/
        ├── main.jsx
        ├── App.jsx            ← lazy-loaded admin routes (code splitting)
        ├── index.css
        ├── api/
        │   ├── client.js      ← axios instance + JWT interceptor + 401 auto-logout
        │   └── index.js       ← typed API surface + buildMultipart helper
        ├── context/
        │   └── AuthContext.jsx
        ├── routes/
        │   └── ProtectedRoute.jsx
        ├── hooks/
        │   ├── usePortfolio.js  ← sessionStorage cache for instant render
        │   └── useComments.js
        ├── lib/
        │   └── introState.js    ← sessionStorage-safe (Safari private mode OK)
        ├── styles/
        │   └── admin.css        ← shared .admin-input (no per-render <style> dupes)
        ├── components/
        │   ├── AnimatedBackground.jsx
        │   ├── WelcomeScreen.jsx
        │   ├── MarkdownRenderer.jsx   ← react-markdown v9 compatible
        │   ├── ui/Navbar.jsx
        │   ├── band/                  ← 3D hero card (lazy-loaded)
        │   │   ├── App.jsx
        │   │   ├── TextType.jsx
        │   │   └── index.css
        │   └── sections/
        │       ├── Hero.jsx
        │       ├── About.jsx
        │       ├── Resume.jsx
        │       ├── PortfolioShowcase.jsx
        │       ├── PortfolioCard.jsx
        │       └── contact/
        │           ├── ContactSection.jsx
        │           ├── ContactForm.jsx
        │           └── CommentsSection.jsx
        └── pages/
            ├── Home.jsx
            ├── PortfolioDetail.jsx
            └── admin/
                ├── AdminLayout.jsx
                ├── Login.jsx
                ├── Dashboard.jsx
                ├── Projects.jsx
                ├── ProjectEdit.jsx
                ├── Certificates.jsx
                ├── Tech.jsx
                ├── Comments.jsx
                └── Messages.jsx
```

---

## Quick Start (Local)

### Prerequisites

- **Node.js 18+** and npm
- **MongoDB** — either a local instance (`mongodb://127.0.0.1:27017/portfolio`)
  or a free **MongoDB Atlas** cluster

### 1. Clone & install

```bash
git clone https://github.com/realmrhak/3D-Portfolio.git
cd 3D-Portfolio

# Backend
cd backend
cp .env.example .env
npm install

# Frontend (new terminal)
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure environment

Edit `backend/.env` — at minimum set:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — generate with:
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — initial admin credentials
- `ALLOWED_ORIGINS` — `http://localhost:5173` (Vite dev server)

Edit `frontend/.env`:

- `VITE_API_URL=http://localhost:5000/api`

### 3. Seed the database (optional but recommended)

```bash
cd backend
npm run seed
```

This creates the admin user and inserts sample projects, certificates, and
tech stacks so the public site has content on first load.

**Tech stack logos** are NOT pre-seeded — each item ships with an empty
`logo_url`. The UI renders a graceful fallback (the first letter of the
name in a styled box) until you upload a logo. To add logos, log into the
admin panel at `/admin/tech` and either upload an image file or paste a
logo URL (e.g. from [Simple Icons](https://simpleicons.org)) for each item.

### 4. Run

```bash
# Backend (terminal 1)
cd backend
npm run dev    # nodemon, auto-reload on save

# Frontend (terminal 2)
cd frontend
npm run dev    # Vite, http://localhost:5173
```

Open <http://localhost:5173>. The admin panel is at
<http://localhost:5173/admin/login>.

---

## Environment Variables

### Backend (`backend/.env`)

| Var              | Required | Description                                                              |
| ---------------- | -------- | ----------------------------------------------------------------------- |
| `PORT`           | no       | Default `5000`                                                          |
| `NODE_ENV`       | no       | `development` or `production`                                           |
| `MONGODB_URI`    | **yes**  | MongoDB connection string                                               |
| `JWT_SECRET`     | **yes**  | Long random string (≥ 32 chars). Server **refuses to start** without it |
| `JWT_EXPIRES_IN` | no       | Default `7d`                                                            |
| `ADMIN_NAME`     | no       | Default `Haroon`                                                        |
| `ADMIN_EMAIL`    | no       | Admin email (created by `npm run seed`)                                 |
| `ADMIN_PASSWORD` | **yes\*** | Required in production; dev-only fallback `ChangeMe123!` otherwise     |
| `ALLOWED_ORIGINS` | **yes\*** | Comma-separated CORS allowlist (your Vercel URL in production)         |
| `MAX_UPLOAD_MB`  | no       | Default `5`, hard-capped at `25`                                        |
| `CLOUDINARY_CLOUD_NAME` | **yes\*** | Cloudinary cloud name (required in production on Render free tier) |
| `CLOUDINARY_API_KEY`   | **yes\*** | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | **yes\*** | Cloudinary API secret |

\* Cloudinary is **required in production** because Render's free tier has an
ephemeral filesystem — local uploads are wiped on every deploy. Without
Cloudinary, project images and tech logos won't persist across deploys. Get
free credentials at <https://cloudinary.com>.

\* Production-critical. The server refuses to start without `JWT_SECRET`
and refuses admin-seeding without `ADMIN_PASSWORD`.

### Frontend (`frontend/.env`)

| Var           | Required | Description                          |
| ------------- | -------- | ------------------------------------ |
| `VITE_API_URL` | **yes**  | Backend API origin, e.g. `https://portfolio-backend-xxxx.onrender.com/api` |

---

## Deployment

### Frontend → Vercel

> **Recommended setup — set Root Directory to `frontend`** (avoids any path issues):

1. Push the repo to GitHub.
2. In Vercel, **New Project → Import Git Repository**.
3. **Root Directory:** `frontend` (click "Edit" next to Root Directory and type `frontend`). This is the most reliable setup — Vercel runs `npm install` + `npm run build` directly inside the `frontend` folder and serves the `dist/` output. The included `frontend/vercel.json` handles SPA rewrites + security headers.
4. **Framework Preset:** Vercel will auto-detect "Vite" — leave it.
5. **Build Command:** leave as default (`vite build`) — the `frontend/vercel.json` overrides this anyway.
6. **Output Directory:** leave as default (`dist`) — `frontend/vercel.json` overrides this.
7. **Environment Variables:** add
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
8. Deploy.

> **Alternative setup — leave Root Directory as repo root:**
> If you prefer to keep Root Directory as the repo root, the root-level `vercel.json` will run `cd frontend && npm install && npm run build` and serve `frontend/dist`. Both configs are included in the repo; pick the setup that matches your Vercel project settings.
>
> ⚠️ **Don't mix the two.** If your Vercel project's Root Directory is `frontend`, do NOT also use the root `vercel.json` — Vercel will look for the config in the Root Directory you set, so only `frontend/vercel.json` will be picked up in that case (which is exactly what you want). The error `cd: frontend: No such file or directory` happens when Root Directory is `frontend` but the build command still has `cd frontend` — this is now fixed because `frontend/vercel.json` has `buildCommand: "npm install && npm run build"` (no `cd`).

### Backend → Render

1. In Render, **New → Web Service** from your GitHub repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Health Check Path:** `/health`
6. **Environment Variables:** set everything in the `envVars` section of `render.yaml` (or use Render's Blueprint by committing `render.yaml`).
   - `MONGODB_URI` — Atlas connection string
   - `JWT_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — initial admin
   - `ALLOWED_ORIGINS` — your Vercel URL (e.g. `https://realmrhak-portfolio.vercel.app`)
7. After the first deploy, run the seed once: in Render Shell → `npm run seed`.

### Image Storage → Cloudinary (REQUIRED for Render)

Render's free tier has an **ephemeral filesystem** — local `backend/uploads/`
is wiped on every deploy, so any images you upload via the admin panel
disappear. To fix this, store uploads in Cloudinary (free tier: 25 GB
storage + 25 GB monthly bandwidth — plenty for a portfolio).

1. Sign up at <https://cloudinary.com> (use GitHub login — quickest).
2. After signup, open the **Dashboard** and copy these three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. In your Render service → **Environment** tab → add three env vars:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
4. Save → Render redeploys automatically.
5. Re-upload your project images and tech logos via the admin panel. They
   will now be stored permanently in Cloudinary and survive every redeploy.

> **Without Cloudinary configured**, the backend silently falls back to local
> disk — fine for local dev, broken in production on Render free tier.

### Database → MongoDB Atlas

1. Create a free **M0** cluster.
2. **Database Access** → add a user (username + strong password).
3. **Network Access** → add `0.0.0.0/0` (allow from anywhere — required for
   Render's dynamic IPs).
4. **Connect → Drivers** → copy the connection string, replace `<password>`,
   use as `MONGODB_URI`.

---

## Product Requirements Document (PRD)

### 1. Vision

A premium-feeling personal portfolio that showcases full-stack development
work, supports admin-managed content, and lets visitors leave comments — all
without requiring a third-party backend service.

### 2. Target Audience

- Recruiters evaluating technical capability
- Potential clients deciding whether to commission work
- Fellow developers exploring the codebase
- The site owner (Haroon) managing content via the admin panel

### 3. Goals

- **G1.** Present projects, certificates, and tech stack in a visually
  distinctive way that signals engineering competence.
- **G2.** Let the owner manage all content without touching code (admin panel).
- **G3.** Allow visitors to leave comments (with optional image) and like
  others' comments without an account.
- **G4.** Be fast on mobile (≤ 2s LCP on 4G) and accessible on desktop with
  the 3D hero as a "wow" moment.
- **G5.** Be cheaply deployable on free tiers (Vercel + Render + Atlas).

### 4. Non-Goals

- No multi-user accounts (only one admin).
- No blog / CMS scheduling.
- No i18n (English only).
- No SSR / SEO optimization beyond OG meta tags (it's a portfolio SPA).

### 5. User Stories

#### Visitor (public)
- **V1.** As a visitor, I want to see Haroon's name, role, and a tagline
  within 1 second so I know I'm in the right place.
- **V2.** As a visitor, I want a 3D card I can drag on desktop so the site
  feels alive and showcases front-end craft.
- **V3.** As a visitor, I want to browse projects, certificates, and tech
  stack in tabs so I can quickly find what I care about.
- **V4.** As a visitor, I want to open a project detail page with markdown
  long-description so I can read about a project in depth.
- **V5.** As a visitor, I want to leave a comment (with optional image) and
  like others' comments so the site feels interactive.
- **V6.** As a visitor, I want to send a contact message that the owner
  receives so I can propose work.
- **V7.** As a mobile visitor, I want the site to load fast and not feel
  janky (the 3D scene is desktop-only; mobile shows a static profile photo).

#### Admin (Haroon)
- **A1.** As admin, I want to log in with email + password and be redirected
  to a dashboard.
- **A2.** As admin, I want to see aggregate counts (projects, certificates,
  comments, messages, unread messages, tech stack) at a glance.
- **A3.** As admin, I want to create / edit / delete projects, with file
  upload OR image URL, tags, live URL, and a markdown long-description.
- **A4.** As admin, I want to manage certificates (title, issuer, issue date,
  image).
- **A5.** As admin, I want to manage tech stack entries (name, category,
  optional logo).
- **A6.** As admin, I want to pin / unpin / delete visitor comments.
- **A7.** As admin, I want to view contact messages, mark them read, reply
  via `mailto:`, and delete them.

### 6. Functional Requirements

| ID  | Requirement                                                                                     |
| --- | ---------------------------------------------------------------------------------------------- |
| FR1 | Public home page with hero, about, resume, portfolio showcase, contact, and comments sections. |
| FR2 | 3D hero card (three.js + rapier) on desktop only; static profile photo on mobile.              |
| FR3 | Portfolio showcase with three tabs (projects / certificates / tech stack).                     |
| FR4 | Project detail page (`/portfolio/:id`) rendering markdown long-description safely.             |
| FR5 | Contact form (name, email, message) → POST `/api/messages`.                                    |
| FR6 | Comments section with image upload, likes (one per browser), and pinned-first ordering.        |
| FR7 | Admin login (JWT), dashboard, and CRUD for projects / certificates / tech / comments / messages. |
| FR8 | File upload (jpg/jpeg/png/webp/gif), max 5 MB, validated by extension + MIME + magic bytes.    |
| FR9 | Health-check endpoint `/health` for Render.                                                    |

### 7. Non-Functional Requirements

| ID  | Category    | Requirement                                                                  |
| --- | ---------- | --------------------------------------------------------------------------- |
| NFR1 | Performance | LCP ≤ 2.5s on 4G mobile (3D scene lazy-loaded, only desktop).               |
| NFR2 | Performance | API p95 latency ≤ 300 ms for read endpoints (MongoDB indexed).             |
| NFR3 | Security    | All admin routes require JWT + `admin` role.                                |
| NFR4 | Security    | All user-supplied text is HTML-stripped server-side before storage.         |
| NFR5 | Security    | File uploads verified by magic-byte signature (not just extension/MIME).    |
| NFR6 | Security    | No internal error messages leaked in production 5xx responses.              |
| NFR7 | Availability | Health check `/health` returns 200 within 1 s of cold start.               |
| NFR8 | Maintainability | No duplicated `<style>` blocks; shared admin CSS module.                |
| NFR9 | Compatibility | Modern evergreen browsers (Chrome, Firefox, Safari, Edge last 2 versions). |
| NFR10 | Cost       | Deployable entirely on free tiers.                                          |

### 8. Success Metrics

- Initial JS payload (gzipped) ≤ 250 KB on first paint (excluding lazy 3D chunk).
- 0 console errors on public home page load.
- Lighthouse Performance ≥ 90 on desktop, ≥ 75 on mobile.
- 0 high-severity vulnerabilities in `npm audit`.

---

## Technical Requirements Document (TRD)

### 1. Architecture

```
┌────────────┐         HTTPS/JSON         ┌──────────────┐         TCP          ┌────────────┐
│  Browser   │ ─────────────────────────▶ │  Render API  │ ───────────────────▶ │  MongoDB   │
│ (Vite SPA) │ ◀───────────────────────── │  (Express)   │ ◀─────────────────── │  (Atlas)   │
└────────────┘    /api/* + /uploads/*      └──────────────┘   Mongoose 8 (pool)  └────────────┘
     ▲                                          │
     │ static assets (HTML/JS/CSS/images)       │ local disk uploads/ (ephemeral on Render free)
     ▼                                          ▼
┌────────────┐                          ┌──────────────┐
│  Vercel    │                          │  Render disk │
│  (Next? →  │                          │  (ephemeral) │
│   Vite)    │                          └──────────────┘
└────────────┘
```

### 2. Frontend Architecture

- **React 18 + Vite 5** SPA with `BrowserRouter`. No SSR (it's a portfolio; SEO
  is satisfied by OG meta tags).
- **Code splitting:** admin pages lazy-loaded via `React.lazy`. The heavy 3D
  hero (`three` + `@react-three/rapier` + `meshline`, ~1 MB gzipped) is a
  separate lazy chunk that only loads on desktop. Initial bundle is
  ~160 KB gzipped (HTML + CSS + vendor-react + vendor-motion + index.js).
- **Manual chunks** (vite.config.js → `manualChunks`):
  - `vendor-three` — three.js, fiber, drei, rapier, meshline
  - `vendor-motion` — framer-motion, gsap
  - `vendor-react` — react, react-dom, react-router
  - `vendor-swal` — sweetalert2
  - `vendor-markdown` — react-markdown, remark-gfm, rehype-sanitize
- **State management:** React Context for auth (`AuthContext`); local hooks
  (`usePortfolio`, `useComments`) for data fetching with `sessionStorage`
  caching for instant re-render on subsequent navigations.
- **HTTP client:** Axios with a single shared instance (`api/client.js`),
  JWT bearer token interceptor, automatic 401 → logout → redirect to
  `/admin/login` if on an admin route.
- **Styling:** Tailwind CSS 3 + inline styles where motion needs JS-driven
  values. Shared `frontend/src/styles/admin.css` for `.admin-input`.
- **Build:** `vite build` → `terser` with `drop_console` and `drop_debugger`
  for production. No source maps in production.

### 3. Backend Architecture

- **Express 4** with ESM (`"type": "module"`).
- **Middleware order** (`server.js`):
  1. `helmet` (CORS-friendly `crossOriginResourcePolicy: 'cross-origin'` so
     the frontend can load `/uploads/*` images)
  2. `cors` (allowlist from `ALLOWED_ORIGINS`)
  3. `express.json` + `express.urlencoded` (1 MB limit)
  4. `compression` (gzip)
  5. `morgan` (dev=`dev`, prod=`combined`)
  6. Static `/uploads` (7-day immutable cache)
  7. Global `apiLimiter` on `/api/*`
  8. Routes
  9. `notFound` → `errorHandler`
- **Mongoose 8** with `strictQuery: true`, `maxPoolSize: 10`,
  `serverSelectionTimeoutMS: 15000`. Connection event listeners
  (`error`, `disconnected`, `reconnected`) registered **before** `connect()`
  so no event is missed.
- **Auth:** JWT signed with `HS256` (algorithm explicitly pinned on both
  sign and verify to prevent `alg=none` attacks). Server refuses to start
  if `JWT_SECRET` is unset.
- **File uploads:** Multer disk storage in `backend/uploads/`. The directory
  is auto-created with `fs.mkdirSync({ recursive: true })` on module load so
  cold starts on ephemeral filesystems (Render free) don't fail. After
  Multer writes the file, `verifyImageMagic` middleware reads the first 16
  bytes and rejects anything that doesn't match a known image signature
  (JPG `FFD8FF`, PNG `89504E47…`, GIF `47494638`, WEBP `52494646`).
- **Rate limiting:** three tiers —
  - `apiLimiter` (100 req / 15 min / IP) on all `/api/*`
  - `authLimiter` (10 / 15 min) on `POST /api/auth/login`
  - `writeLimiter` (20 / hour) on `POST /api/comments`, `PUT /api/comments/:id/like`, `POST /api/messages`

### 4. Data Model

#### User
```
{
  name:      String (≤ 80, required)
  email:     String (lowercase, unique, email regex, required)
  password:  String (≥ 8, bcrypt cost 12, select: false, required)
  role:      Enum['admin', 'editor'] default 'editor'
  timestamps: true
}
```
Pre-save **and** pre-findOneAndUpdate hooks hash the password — so updates
via `findByIdAndUpdate({ password })` are also protected.

#### Project
```
{
  title:            String (≤ 120, required)
  description:      String (≤ 1000, required)
  image_url:        String (default '')
  live_url:         String (default '')
  long_description: String (≤ 8000, markdown)
  tags:             [String]
  is_featured:      Boolean (default false)
  timestamps:       true
}
index: { is_featured: -1, createdAt: 1 }
```

#### Certificate
```
{
  title:     String (≤ 160, required)
  issuer:    String (≤ 160)
  image_url: String (required)
  issued_at: Date (nullable)
  timestamps: true
}
```

#### TechStack
```
{
  name:     String (≤ 80, required, unique)
  logo_url: String (default '')
  category: String (≤ 60, default 'General')
  timestamps: true
}
```

#### Comment
```
{
  name:      String (≤ 60, required)
  comment:   String (≤ 1000, required)
  image_url: String (nullable)
  likes:     Number (default 0, min 0)
  is_pinned: Boolean (default false)
  likedBy:   [String]   ← HMAC-SHA256 fingerprints, never returned to client
  timestamps: true
}
index: { is_pinned: -1, createdAt: -1 }
```

#### Message
```
{
  name:    String (≤ 80, required)
  email:   String (lowercase, email regex, required)
  message: String (≤ 2000, required)
  is_read: Boolean (default false)
  timestamps: true
}
index: { is_read: 1, createdAt: -1 }
```

### 5. API Endpoints

All write/admin endpoints are protected; admin endpoints additionally
require `role === 'admin'`.

| Method | Path                          | Auth          | Rate limit    | Description                              |
| ------ | ----------------------------- | ------------- | ------------- | ---------------------------------------- |
| POST   | `/api/auth/login`             | none          | authLimiter   | Returns `{ token, user }`                |
| GET    | `/api/auth/me`                | JWT           | apiLimiter    | Returns current user                     |
| GET    | `/api/projects`               | none          | apiLimiter    | List projects                            |
| GET    | `/api/projects/:id`           | none          | apiLimiter    | Single project                           |
| POST   | `/api/projects`               | JWT + admin   | apiLimiter    | Create (multipart or JSON)               |
| PUT    | `/api/projects/:id`           | JWT + admin   | apiLimiter    | Update (whitelisted fields)              |
| DELETE | `/api/projects/:id`           | JWT + admin   | apiLimiter    | Delete                                   |
| GET    | `/api/certificates`           | none          | apiLimiter    | List certificates                        |
| GET    | `/api/certificates/:id`       | none          | apiLimiter    | Single certificate                       |
| POST   | `/api/certificates`           | JWT + admin   | apiLimiter    | Create                                   |
| PUT    | `/api/certificates/:id`       | JWT + admin   | apiLimiter    | Update                                   |
| DELETE | `/api/certificates/:id`       | JWT + admin   | apiLimiter    | Delete                                   |
| GET    | `/api/tech`                   | none          | apiLimiter    | List tech stack                          |
| POST   | `/api/tech`                   | JWT + admin   | apiLimiter    | Create                                   |
| PUT    | `/api/tech/:id`               | JWT + admin   | apiLimiter    | Update                                   |
| DELETE | `/api/tech/:id`               | JWT + admin   | apiLimiter    | Delete                                   |
| GET    | `/api/comments`               | none          | apiLimiter    | List (pinned first, newest next)         |
| POST   | `/api/comments`               | none          | writeLimiter  | Create (multipart, optional image)       |
| PUT    | `/api/comments/:id/like`      | none          | writeLimiter  | Like (atomic, one per fingerprint)       |
| PUT    | `/api/comments/:id/pin`       | JWT + admin   | apiLimiter    | Toggle pin                               |
| DELETE | `/api/comments/:id`           | JWT + admin   | apiLimiter    | Delete                                   |
| POST   | `/api/messages`               | none          | writeLimiter  | Submit contact message                   |
| GET    | `/api/messages`               | JWT + admin   | apiLimiter    | List (unread first)                      |
| PUT    | `/api/messages/:id/read`      | JWT + admin   | apiLimiter    | Mark read                                |
| DELETE | `/api/messages/:id`           | JWT + admin   | apiLimiter    | Delete                                   |
| GET    | `/api/dashboard/stats`        | JWT + admin   | apiLimiter    | Aggregate counts                         |
| GET    | `/health`                     | none          | none          | Render health check                      |

### 6. Security Architecture

- **JWT:** HS256 with explicitly-pinned algorithm on both `sign` and
  `verify`. Server refuses to boot without `JWT_SECRET`.
- **Password hashing:** bcrypt cost factor 12, applied in both `pre('save')`
  and `pre('findOneAndUpdate')` hooks (so `User.findByIdAndUpdate({ password })`
  also hashes — without this, any future code path using `findByIdAndUpdate`
  to change a password would store plaintext).
- **Mass-assignment protection:** every `update*` controller builds an
  explicit `update` object by picking only whitelisted fields from `req.body`
  — never `{ ...req.body }`. Prevents overwriting `_id`, `__v`,
  `createdAt`, `likedBy`, etc.
- **Role-based access:** admin routes use `protect, restrictTo('admin')`.
  Future `editor` users could read the dashboard but not mutate.
- **Input sanitization:** all user-supplied text fields (name, comment,
  message, title, etc.) pass through `stripHtml` (sanitize-html with
  `allowedTags: []`) before storage. The only field that intentionally
  preserves markdown syntax is `Project.long_description`, which is rendered
  on the frontend with `rehype-sanitize` (allow-list of safe tags, schemes
  limited to `http`/`https`/`mailto`).
- **File uploads:** triple-layered validation:
  1. Extension allow-list (`.jpg .jpeg .png .webp .gif`)
  2. MIME-type prefix check (`image/*`)
  3. **Magic-byte signature verification** — reads first 16 bytes of the
     saved file and rejects anything that doesn't match a known image
     header. Removes the bogus file from disk. This catches renamed
     malicious payloads that bypass #1 and #2.
- **CORS:** `ALLOWED_ORIGINS` env var defines an allowlist. In production
  with no allowlist configured, the server refuses cross-origin browser
  requests (server-to-server calls without an Origin header are still
  allowed).
- **Rate limiting:** three tiers (see §3 above). `trust proxy = 1` so
  `req.ip` resolves correctly behind Render's load balancer.
- **Helmet** with `crossOriginResourcePolicy: 'cross-origin'` (so the
  frontend can load `/uploads/*` images) and `contentSecurityPolicy: false`
  (API-only server, no browser-rendered HTML from us).
- **Error handling:** the central `errorHandler` returns generic
  `"Internal server error"` for any 5xx in production — never the raw
  `err.message` (which could leak stack paths or Mongoose internals).
- **Like fingerprinting:** the `likedBy` array stores **HMAC-SHA256**
  fingerprints (using `JWT_SECRET` as the key) of the browser ID or IP.
  Attackers cannot precompute fingerprints to inflate likes. The
  `likedBy` array is stripped from every response. Likes are incremented
  atomically via `findOneAndUpdate` with `$addToSet` + `$inc`, eliminating
  the read-modify-write race.
- **No plaintext password logging:** the seed script logs only the email,
  never the password. `ADMIN_PASSWORD` is required in production (the
  server exits if missing).

### 7. Performance Architecture

- **Frontend**
  - Initial bundle ≈ 160 KB gzipped (HTML + CSS + vendor-react +
    vendor-motion + index.js). Lazy-loaded: 3D chunk (~1 MB gzipped,
    desktop only), sweetalert2 (only when a popup is shown),
    react-markdown (only on portfolio detail), and all admin pages.
  - `sessionStorage` cache in `usePortfolio` hydrates the portfolio from
    cache instantly while the API call revalidates in the background.
  - `loading="lazy"` on all `<img>` tags below the fold.
  - `font-display: swap` (via Google Fonts `&display=swap`) + `<link rel="preload">`
    so the font CSS doesn't block first paint.
  - `<link rel="preconnect">` to the API origin so TLS handshakes warm up
    before the first API call.
  - Vite `terserOptions.drop_console` strips `console.log` in production.
  - 7-day immutable `Cache-Control` on `/uploads/*` (Render + Vercel both
    honor this).

- **Backend**
  - Mongoose `lean()` on all read endpoints (skips hydration → ~2× faster).
  - Projection (`.select(...)`) on list endpoints to avoid sending `likedBy`,
    `__v`, etc. over the wire.
  - Indexes back the sort order of every list query:
    - `Project: { is_featured: -1, createdAt: 1 }`
    - `Comment: { is_pinned: -1, createdAt: -1 }`
    - `Message: { is_read: 1, createdAt: -1 }`
  - Gzip compression via `compression()` middleware.
  - Connection pool size 10 (sufficient for Render free tier's 512 MB RAM).
  - Atomic like increment via `findOneAndUpdate` + `$addToSet` + `$inc`
    (no read-modify-write race, no double-increment).

### 8. Build & Deploy Pipeline

```
git push → GitHub
              ├─→ Vercel webhook → cd frontend && npm install && npm run build → deploy dist/
              └─→ Render webhook  → cd backend  && npm install                 → npm start
                                   (health check on /health)
```

- Vercel config: root-level `vercel.json` (so the whole repo can be imported
  as a single Vercel project).
- Render config: `render.yaml` Blueprint (import as "Blueprint" in Render
  dashboard to auto-provision the service with all env vars).
- MongoDB Atlas: free M0 cluster, network access `0.0.0.0/0`.

### 9. Monitoring & Observability

- **Health check:** `GET /health` returns `{ status, uptime, timestamp, env }`.
  Render pings this every few seconds; restarts on failure.
- **Logging:** `morgan` (combined format in production) writes to stdout
  (Render captures). `console.error` for unhandled rejections, DB errors,
  and the central error handler.
- **No external APM** in this version (would add `@sentry/node` +
  `@sentry/react` for production-grade tracing).

### 10. Testing Strategy

The original repo included smoke-test and diagnostic scripts (`utils/smokeTest.js`,
`utils/diagnoseMongo.js`) — these have been **removed** because they had
multiple bugs (invalid DB name regex, non-awaited `server.close()`, fragile
password-mask regex) and weren't part of the core product. A future iteration
should add:

- **Backend:** `vitest` + `supertest` for endpoint tests, with `mongodb-memory-server`
  for an in-memory DB.
- **Frontend:** `vitest` + `@testing-library/react` for component tests,
  `playwright` for one E2E test that logs in and creates a project.

---

## Security

This project implements defense-in-depth across multiple layers. See the
**Security Architecture** section of the TRD above for the full list.

### Highlights

- ✅ JWT `HS256` algorithm explicitly pinned on sign + verify
- ✅ Server refuses to boot without `JWT_SECRET`
- ✅ bcrypt cost factor 12, applied in both save and update hooks
- ✅ Mass-assignment protection on every update controller (whitelisted fields)
- ✅ Role-based admin route protection (`protect + restrictTo('admin')`)
- ✅ Triple-layer file upload validation (extension + MIME + magic bytes)
- ✅ HTML stripping on every user-supplied text field
- ✅ Markdown rendering uses `rehype-sanitize` allow-list
- ✅ Like fingerprints are HMAC'd with server secret (not precomputable)
- ✅ Atomic like increment (no race condition)
- ✅ No plaintext password logging
- ✅ Generic error messages in production 5xx responses
- ✅ Helmet + CORS allowlist + 3-tier rate limiting
- ✅ `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` headers on Vercel-deployed frontend
- ✅ Vite `drop_console` strips logs from production bundle

### Known Limitations

- The `likedBy` array grows linearly with likes per comment. For a personal
  portfolio this is fine; if a comment went viral you'd want to migrate to a
  separate `Like` collection or a HyperLogLog counter.
- Uploads are stored on Render's ephemeral disk. They survive until the
  service redeploys, at which point the disk is wiped. For permanent
  storage, swap `multer.diskStorage` for an S3-compatible backend
  (`multer-s3` + Cloudflare R2 / AWS S3).
- The in-memory `express-rate-limit` store resets on each deploy. For a
  multi-instance deploy, use `rate-limit-redis`.
- No CSRF protection — the JWT is in `localStorage` (not cookies), so CSRF
  is not applicable. The trade-off is that XSS could exfiltrate the token;
  this is mitigated by the strict CSP-like sanitization on all user content.

---

## Performance

See the **Performance Architecture** section of the TRD above for details.

### Measured

| Metric                              | Value (gzipped)        |
| ---------------------------------- | --------------------- |
| Initial HTML                       | 1.05 KB               |
| Initial CSS                        | 6.01 KB               |
| vendor-react                       | 50.45 KB              |
| vendor-motion                      | 64.82 KB              |
| index.js (app code)                | 37.90 KB              |
| vendor-swal (lazy, only when used) | 19.93 KB              |
| vendor-markdown (lazy, detail page)| 49.62 KB              |
| vendor-three (lazy, desktop only)  | 1,034.45 KB           |
| **Initial paint total (gzipped)**  | **≈ 160 KB**          |

### Optimizations Applied

- 3D scene lazy-loaded and desktop-only
- Admin pages lazy-loaded
- SweetAlert2 split into its own chunk (only loaded when first popup fires)
- React-markdown split into its own chunk (only loaded on portfolio detail)
- sessionStorage cache for portfolio data (instant re-render)
- `loading="lazy"` on all below-the-fold images
- `lean()` + projection on all backend list endpoints
- Indexes back every list query's sort order
- 7-day immutable cache headers on `/uploads/*`
- Gzip compression on all API responses
- `font-display: swap` + `<link rel="preload">` for fonts
- `<link rel="preconnect">` to API origin
- `drop_console` + `drop_debugger` in production bundle

---

## Bugs Fixed From Original

The original repo (`realmrhak/3D-Portfolio`) had a number of bugs and
security issues. Below is a categorized list of every fix applied in this
revision.

### 🔴 Security Fixes

1. **Mass-assignment vulnerability** — every `update*` controller previously
   used `{ ...req.body }`, allowing an attacker (or anyone with a leaked
   admin token) to overwrite `_id`, `__v`, `createdAt`, `likedBy`, etc.
   Fixed by building an explicit `update` object with whitelisted fields
   only. (projectController, certificateController, techController)

2. **JWT algorithm not pinned** — `jwt.verify(token, JWT_SECRET)` without an
   `algorithms` option is vulnerable to the `alg=none` attack on older
   `jsonwebtoken` versions. Fixed by explicitly passing
   `{ algorithms: ['HS256'] }` on both sign and verify.

3. **JWT_SECRET not validated at startup** — if `JWT_SECRET` was unset,
   `jwt.sign` would throw inside the request handler (500) on every login.
   Fixed: the server now refuses to start without `JWT_SECRET`.

4. **Default admin role was `'admin'`** — if a registration endpoint were
   ever added, every new user would be an admin. Changed default to
   `'editor'`.

5. **Default admin password + plaintext logging in seed script** — the seed
   used `process.env.ADMIN_PASSWORD || 'ChangeMe123!'` and printed the
   password to stdout. Fixed: `ADMIN_PASSWORD` is now required in
   production (server exits otherwise), and the password is never logged.

6. **File upload validation was client-spoofable** — extension and MIME
   type both come from the client. Added `verifyImageMagic` middleware
   that reads the first 16 bytes of the saved file and rejects anything
   that doesn't match a known image signature. Also auto-creates the
   `uploads/` directory with `fs.mkdirSync({ recursive: true })` so the
   first request after a cold start doesn't fail with `ENOENT`.

7. **MAX_UPLOAD_MB parsed unsafely** — `Number(process.env.MAX_UPLOAD_MB)`
   returned `NaN` if the env var was a non-numeric string, causing multer
   to silently reject every upload. Fixed with a safe parse + 25 MB hard cap.

8. **Error handler leaked internal messages in production** — any 5xx
   returned the raw `err.message` (which could include stack paths or
   Mongoose internals). Fixed: returns `"Internal server error"` for any
   5xx in production.

9. **`restrictTo` defined but never used** — admin-only routes relied only
   on `protect`. Now every admin mutation route uses
   `protect, restrictTo('admin')`.

10. **Like fingerprint fallback shared** — if both `x-browser-id` and `req.ip`
    were missing, all anonymous users shared the `'anon'` fingerprint, so
    only one anonymous like was possible globally. Also, `x-browser-id` was
    fully client-controlled, so an attacker rotating it could inflate likes
    arbitrarily. Fixed: fingerprints are now HMAC-SHA256 of the input with
    `JWT_SECRET` (so attackers can't precompute), and the `'anon'` fallback
    is removed (the endpoint returns 400 if no fingerprint can be derived).

11. **Password hashing bypassed on `findByIdAndUpdate`** — the `pre('save')`
    hook only fired on `User.save()`. Any code path using
    `User.findByIdAndUpdate({ password })` would store plaintext. Added a
    `pre('findOneAndUpdate')` hook that hashes the password field if set.

12. **Comment substring matching in error handler** —
    `err.message.includes('not allowed')` would match any unrelated error
    whose message happened to contain "not allowed". Tightened to a regex
    match plus explicit `MulterError` / `LIMIT_UNEXPECTED_FILE` code check.

### 🟠 Performance / Correctness Fixes

13. **Race condition in `likeComment`** — non-atomic read-modify-write
    allowed two concurrent likes to both pass the `includes` check and both
    push, double-counting. Replaced with atomic
    `findOneAndUpdate({ _id, likedBy: { $ne: fp } }, { $addToSet, $inc })`.

14. **`connectDB` registered event listeners after connect** — any error
    emitted between `mongoose.connect()` resolving and the listener
    registration was lost. Moved listeners **before** the `connect()` call.

15. **Sort comment/sort mismatch** — projectController comment said
    "newest first" but sorted `createdAt: 1` (oldest first). Fixed comment
    AND sort order to `is_featured: -1, createdAt: 1` (featured first,
    then oldest first, matching the original portfolio's intended display).

16. **Dead text index on Project** — `projectSchema.index({ title: 'text',
    description: 'text' })` was declared but no search endpoint used it,
    slowing writes for no benefit. Removed; replaced with a useful
    `{ is_featured: -1, createdAt: 1 }` index that backs the actual
    list-query sort.

17. **Process-level handlers registered too late** — `unhandledRejection`
    and `uncaughtException` were registered after `await connectDB()` and
    `app.listen()`, so a startup rejection was uncaught. Moved to the top
    of `server.js`.

18. **Top-level `await connectDB()` outside try/catch** — works only
    because `connectDB` swallows errors and calls `process.exit`. Wrapped
    in a try/catch to be safe against future refactors.

19. **Removed broken utility scripts** — `utils/smokeTest.js` had an
    invalid DB-name regex (`-smoke-test` is not a valid MongoDB database
    name) and didn't await `server.close()`. `utils/diagnoseMongo.js` had
    a fragile password-mask regex that broke on passwords containing `@`.
    Both removed; the corresponding `npm run smoke` and `npm run diag`
    scripts removed from `package.json`.

20. **Removed dead `haroon-1.png`** — 1.5 MB unreferenced image in
    `public/assets/`. Saves ~1.5 MB from the production bundle.

21. **Removed empty `backend/public/` directory** — only contained a
    `.gitkeep`, never used by any route.

22. **Backend list endpoints returned full documents** — added `.lean()`
    and `.select(...)` projections to skip hydration cost and trim
    `likedBy`, `__v`, etc. from the wire payload.

### 🟡 Frontend Bug Fixes

23. **Memory leaks from `URL.createObjectURL`** — `CommentsSection`,
    `Certificates`, `Tech`, and `ProjectEdit` all created blob URLs for
    image previews without ever revoking them. Each file selection
    accumulated a new blob URL in memory. Fixed by tracking the URL in a
    `useRef`, revoking before assigning a new one, and revoking on unmount
    via a cleanup effect.

24. **`MarkdownRenderer` broken on `react-markdown` v9** — the `code`
    component used `({ node, inline, ...props })`, but v9 removed the
    `inline` prop. Inline code was rendered inside `<pre><code>`, breaking
    inline formatting. Fixed by detecting block code via the `className`
    (`language-xxx`) which is only set on fenced code blocks.

25. **`Login.jsx` setTimeout not cleaned up** — `setTimeout(() =>
    navigate(...), 600)` had no cleanup; navigating away within 600 ms
    triggered a React "setState on unmounted component" warning. Fixed:
    timer stored in a `useRef`, cleared on unmount.

26. **`Login.jsx` Swal not awaited** — `Swal.fire({...timer: 1200})` was
    fired and `setTimeout(() => navigate(...))` ran immediately, leaving
    the popup mounted over the new route. Fixed: `await Swal.fire(...)`
    before navigating.

27. **`introState.js` crashed in Safari private mode** — `sessionStorage`
    access throws when storage is disabled (some Safari private-mode
    configurations, sandboxed iframes). Wrapped all three functions in
    `try/catch` so the intro simply replays next time instead of breaking
    the page.

28. **`Messages.jsx` mailto URL not encoded** — `mailto:${m.email}?subject=Re: your message`
    broke on emails or subjects containing special characters. Fixed with
    `encodeURIComponent` on both email and subject.

29. **`Comments.jsx` / `Messages.jsx` / `PortfolioDetail.jsx` `Invalid Date`**
    — `new Date(c.createdAt).toLocaleString()` returned `"Invalid Date"`
    when `createdAt` was missing/null. Added null guards.

30. **`PortfolioDetail.jsx` `navigate(-1)` exited the app** — if a user
    landed directly on a portfolio detail (e.g. from a shared link),
    `navigate(-1)` would leave the SPA. Fixed: falls back to `navigate('/')`
    if `window.history.length <= 1`.

31. **`PortfolioDetail.jsx` `tags.join` crash** — `project.tags.length > 0`
    passed for strings too, which would then throw on `.join`. Fixed with
    `Array.isArray(project.tags)` guard.

32. **Duplicate `<style>` blocks** — `Certificates.jsx`, `Tech.jsx`, and
    `ProjectEdit.jsx` each emitted a `<style>` defining the global
    `.admin-input` class on every render, overwriting each other. Moved to
    a single shared `frontend/src/styles/admin.css` imported once by
    `AdminLayout`.

33. **`Dashboard.jsx` silently showed `0` on error** — fetch failures only
    `console.error`'d. Added a visible error state.

34. **`Projects.jsx` double popup after delete** — the Swal confirm dialog
    was immediately followed by a second Swal success popup. Changed the
    success popup to a toast (`toast: true, position: 'top-end'`) so it
    doesn't feel like two confirmations.

35. **`AdminLayout` used array index as key** — `key={i}` for menu items.
    Changed to `key={menu.path}` (stable identity).

### 🔵 Build / Tooling Fixes

36. **`vite.config.js`** — added `vendor-swal` and `vendor-markdown`
    manual chunks so the initial bundle stays small. Added a dev-server
    proxy for `/api` and `/uploads` so the frontend can hit relative URLs
    in local dev without hardcoding `localhost:5000`.

37. **`index.html`** — added `<link rel="preconnect">` to the API origin,
    `font-display: swap` preconnect, Twitter card meta tags, `robots`
    meta, and `viewport-fit=cover` for notch-safe mobile.

38. **`.gitignore`** — expanded to cover `build/`, `.env.*.local`, editor
    dirs, `.vercel`, `.render`.

39. **`vercel.json`** — moved from `frontend/vercel.json` to repo root so
    the whole repo can be imported as a single Vercel project. Added
    caching headers for `/assets/*` and security headers
    (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
    `Permissions-Policy`).

40. **`render.yaml`** — clarified that `ADMIN_PASSWORD` is required in
    production.

---

## API Reference

See the [TRD → API Endpoints](#6-api-endpoints) table for the full list.

### Auth flow

1. `POST /api/auth/login` with `{ email, password }` → returns
   `{ token, user }`.
2. Store `token` in `localStorage`.
3. Subsequent requests include `Authorization: Bearer <token>` (the Axios
   interceptor on the frontend does this automatically).
4. On 401 response, the interceptor clears the token and redirects to
   `/admin/login` if on an admin route.

### Example: create a project

```bash
curl -X POST https://<your-render-service>.onrender.com/api/projects \
  -H "Authorization: Bearer <JWT>" \
  -F "title=My New Project" \
  -F "description=A short description" \
  -F "tags=React" \
  -F "tags=Node.js" \
  -F "is_featured=true" \
  -F "long_description=# Heading\n\nMarkdown body" \
  -F "image=@/path/to/screenshot.png"
```

### Example: like a comment

```bash
curl -X PUT https://<your-render-service>.onrender.com/api/comments/<id>/like \
  -H "x-browser-id: my-uuid-here"
```

Returns `{ likes: 7, alreadyLiked: false }` (or `{ likes: 7, alreadyLiked: true }`
if the same fingerprint already liked).

---

## License

MIT © Haroon Ameer Khan
