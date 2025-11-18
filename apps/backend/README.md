# Backend (NestJS)

API powering the Instagram-style app: authentication (MongoDB + JWT), social graph, posts, comments, likes (PostgreSQL).

## Features
- Auth module (MongoDB) with hashed passwords + JWT issuance.
- Users, Posts, Comments, Likes modules using PostgreSQL.
- Docker-ready: container builds app, connects to DB containers via service names.

## Local Development
```bash
npm install
npm run dev          # watch mode
npm run start        # production mode
npm run build        # emits dist
```

## Required Env (`apps/backend/.env`)
```
PORT=3001
MONGODB_URI=mongodb://admin:password@localhost:27017/auth?authSource=admin
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=intership
JWT_SECRET=change-me
```

## Tests
```bash
npm run test         # unit
npm run test:e2e
npm run test:cov
```