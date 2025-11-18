## Intership project

Monorepo housing a Next.js frontend (`clients_app`) and NestJS backend (`backend`) with shared packages, Docker orchestration, and multi-DB support.

## Stack at a Glance
- **Frontend:** Next.js 16, React 19, shared UI/types packages.
- **Backend:** NestJS (REST + JWT), MongoDB for auth, PostgreSQL for social data.
- **Tooling:** Turborepo, TypeScript, ESLint/Prettier, Docker Compose (Postgres, Mongo, API, Web).

## Project Structure
```
apps/
  backend/         NestJS API (auth, posts, likes, comments)
  clients_app/     Next.js app (feed, profiles, uploads)
packages/
  ui/              Shared UI primitives
  types/           Cross-app TS types
  eslint-config/
  typescript-config/
```

## Getting Started

```bash
npm install
npm run dev            
npm run build          
npm run lint           
npm run check-types    
```

### Backend only
```bash
cd apps/backend
npm install
npm run dev
```

### Frontend only
```bash
cd apps/clients_app
npm install
npm run dev
```

## Docker Workflow
```bash
npm run docker:dev     
npm run docker:down    
```

Environment expectations:
- `apps/backend/.env` → DB URIs, JWT secret, ports.
- `apps/clients_app/.env.local` → `NEXT_PUBLIC_API_URL`.

