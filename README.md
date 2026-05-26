# CoupleLife OS

Relationship management platform for couples — MongoDB for app data, Firebase for auth, realtime chat, and file storage.

## Monorepo layout

| Path                  | Stack                                    |
| --------------------- | ---------------------------------------- |
| `frontend/`           | Vite + React + Tailwind + PWA            |
| `backend/`            | Express + Mongoose + Firebase Admin      |
| `client/` + `server/` | Legacy Next.js app (optional)            |
| `docs/AUTH.md`        | Authentication contract for all features |

## Quick start

```bash
# Install
npm install

# MongoDB (Docker)
docker compose up mongodb -d

# Env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Dev (API + UI)
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/v1/health

## Auth pattern (every feature)

1. User signs in with Firebase (Google or email).
2. Frontend syncs to `POST /api/v1/auth/sync` → MongoDB user + app JWT.
3. All API calls send `Authorization: Bearer <Firebase ID token>` (see `frontend/src/lib/authFetch.js` and `api/client.js`).
4. Backend runs `verifyAuth` → `requireSyncedUser` → couple membership checks.

See [docs/AUTH.md](docs/AUTH.md) for the full feature map.

## API overview (`/api/v1`)

| Route                     | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `POST /auth/sync`         | Firebase → MongoDB user                        |
| `GET /users/me`           | Profile                                        |
| `GET/POST /couples/*`     | Invite & link partner                          |
| `GET/POST /moods/*`       | Mood log, weekly, calendar, partner comparison |
| `GET/POST /expenses`      | Shared expenses                                |
| `GET/POST /bucket-list/*` | Bucket list CRUD                               |
| `GET/POST /trips`         | Trip planning                                  |
| Chat                      | Firebase Firestore (not REST)                  |

## Deployment suggestions

- **Frontend**: Vercel, Netlify, or Firebase Hosting (`npm run build -w frontend`).
- **Backend**: Railway, Render, or Fly.io with `MONGO_URI` and Firebase Admin env vars.
- **Database**: MongoDB Atlas.
- **Firebase**: Enable Auth (Google + Email), Firestore, Storage; set security rules for couple chat rooms.
