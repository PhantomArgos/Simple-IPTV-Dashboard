# --- STAGE 1: Build Frontend ---
FROM node:20.18.0-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# --- STAGE 2: Build Backend ---
FROM node:20.18.0-alpine AS backend

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./public

# Prisma Client für die richtige Plattform generieren
RUN npx prisma generate
RUN npx tsc


# --- STAGE 3: Final Image ---
FROM node:20.18.0-alpine

WORKDIR /app

COPY --from=backend /app/backend /app

EXPOSE 3001

CMD ["node", "dist/index.js"]
