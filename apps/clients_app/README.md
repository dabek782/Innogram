# Frontend (Next.js)

Next.js 16 (App Router) client for this project: feed, profiles, likes, comments, uploads. Designed to consume the Nest backend via REST.

## Highlights
- App router with `app/` pages (`feed`, `login`, `register`, `profile/[id]`).
- Shared UI + types imported from `packages/`.
- Docker-friendly build using `apps/clients_app/Dockerfile`.

## Local Development
```bash
npm install
npm run dev         
npm run lint
npm run build
npm run start       
```

## Env (`apps/clients_app/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Docker Build Tips
- Dockerfile copies `packages/` before install so `@repo/typescript-config` resolves.
- Remove/adjust `"packageManager"` fields to avoid Yarn/Corepack requirements or add `corepack enable`.
- Run `docker compose build --no-cache frontend` after config changes.

## Deploy
- `npm run build && npm run start` for Node hosting.
- Ensure `NEXT_PUBLIC_API_URL` points to deployed backend.
```// filepath: c:\Users\kubad\Desktop\programowanie\intern_project\my-turborepo\apps\clients_app\README.md
# Frontend (Next.js)

Next.js 16 (App Router) client for the Instagram clone: feed, profiles, likes, comments, uploads. Designed to consume the Nest backend via REST.

## Highlights
- App router with `app/` pages (`feed`, `login`, `register`, `profile/[id]`).
- Shared UI + types imported from `packages/`.
- Docker-friendly build using `apps/clients_app/Dockerfile`.

## Local Development
```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build
npm run start        # production server
```

## Env (`apps/clients_app/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Docker Build Tips
- Dockerfile