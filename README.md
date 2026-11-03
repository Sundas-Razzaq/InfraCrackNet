# InfraCrackNet

Final Year Project: a web platform for inspecting buildings, roads and bridges and detecting cracks with AI.
Engineers and Inspectors work in teams on projects; an Admin manages users, teams and projects.

> **AI is simulated.** Crack analysis currently runs on a mock service. The Admin panel labels every
> analysis/report as "Simulated AI". Results are for demonstration, not a real structural assessment.

## Tech stack

- **Frontend:** React + Vite, React Router, Framer Motion, Font Awesome (`Infra-frontend/`)
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth (`Infra-Backend/`)
- **Services:** Cloudinary (images/video), SMTP email (invitations, password reset)

## Roles

| Role | What they can do |
|---|---|
| **Admin** | Invite users, manage roles/status, create and manage teams (one Engineer lead + Inspectors), create projects, assign a team to a project, monitor inspections / analyses / reports, read the activity log |
| **Engineer** | See and edit (not create/delete) the projects of their own team, review, annotate and validate AI analyses, view reports, view their team (read-only) |
| **Inspector** | See their team's projects (read-only), create inspections, upload images, view analyses, generate and download reports |

Access is team-based: Engineers and Inspectors only ever see data that belongs to their own team.

## Project structure

```
Infra-Backend/    Express API (src/controllers, routes, models, services, middleware)
Infra-frontend/   React app (src/pages, components, api, context, utils, styles)
```

## Getting started (local)

Requirements: a recent Node.js LTS, a MongoDB database, a Cloudinary account, an SMTP account.

### 1. Backend

```bash
cd Infra-Backend
npm install
# create Infra-Backend/.env (see the variables table below)
npm run seed:admin       # creates the first Admin from ADMIN_* variables
npm run dev              # http://localhost:5000
```

### 2. Frontend

```bash
cd Infra-frontend
npm install
npm run dev              # http://localhost:5173
```

Other frontend scripts: `npm run lint`, `npm run build`, `npm run preview`.

## Environment variables

### Backend (`Infra-Backend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret for signing login tokens (`JWT_SECRET_KEY` is also accepted) |
| `PORT` | no | API port (default 5000) |
| `NODE_ENV` | no | `development` or `production` |
| `FRONTEND_URL` | yes in production | Deployed frontend URL. Used for CORS and for links in emails |
| `ALLOWED_ORIGINS` | no | Extra allowed origins, comma separated |
| `BCRYPT_SALT_ROUNDS` | no | Password hashing cost (default 12) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | yes | Image/video storage |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | yes | SMTP settings for invitations and password reset |
| `APP_NAME`, `EMAIL_BRAND_COLOR` | no | Branding used in emails |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | for seeding | First Admin (password: 8+ characters, at least one number) |
| `AI_MODE` | no | `simulated` (default) or `real`. Controls the "Simulated AI" labels in the Admin panel |
| `ANALYSIS_STUCK_MINUTES` | no | Minutes before a running analysis is flagged as stuck (default 15) |
| `TEAM_RECOMMENDED_MIN_INSPECTORS`, `TEAM_RECOMMENDED_MAX_INSPECTORS` | no | Recommended team size shown as a hint (defaults 2 and 3; not enforced) |

### Frontend (`Infra-frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL, e.g. `http://localhost:5000/api` (this is the default) |

`.env` files are git-ignored. Never commit secrets.

## Deployment (Vercel)

Both apps ship with a `vercel.json`, so each can be deployed as its own Vercel project:

- **Backend** (`Infra-Backend/`): runs `server.js` as a serverless function. PDF fonts under `src/pdf/fonts` are
  bundled via `includeFiles`. Add all backend environment variables in the Vercel project settings.
  Set `FRONTEND_URL` to the deployed frontend URL.
- **Frontend** (`Infra-frontend/`): static Vite build with an SPA rewrite to `index.html`. Set
  `VITE_API_BASE_URL` to the deployed backend URL ending in `/api`, then redeploy (Vite reads it at build time).

After the first deploy, run the admin seed once against the production database
(`npm run seed:admin` with the production `MONGO_URI` and `ADMIN_*` values).

## Notes

- Notifications are polled every 30 seconds while the tab is visible.
- Admin screens are code-split, so the Engineer/Inspector bundle stays small.
