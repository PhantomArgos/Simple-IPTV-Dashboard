# Simple IPTV Dashboard

A fullstack IPTV account management dashboard with automatic updates for account expiry and active connections using the Xtream Codes API.

> Built with modern tools like React, Express, Prisma, and PostgreSQL – packaged for Docker or local development.

---

![Release](https://img.shields.io/github/v/release/PhantomArgos/Simple-IPTV-Dashboard?style=for-the-badge)
![Build](https://img.shields.io/github/actions/workflow/status/PhantomArgos/Simple-IPTV-Dashboard/release.yml?label=build&style=for-the-badge)
![GHCR](https://img.shields.io/badge/GHCR-simple--iptv--dashboard-blueviolet?style=for-the-badge&logo=docker)
![License](https://img.shields.io/github/license/PhantomArgos/Simple-IPTV-Dashboard?style=for-the-badge)

---

## 🚀 Getting Started (Docker)

You can run the app using either a standalone container or a full `docker-compose` setup.

### 🔹 Option 1: Run with existing PostgreSQL

> Assumes PostgreSQL is already running and reachable

```bash
docker run -e DATABASE_URL="postgresql://user:password@postgres:5432/iptv" \
  -p 3001:3001 ghcr.io/phantomargos/simple-iptv-dashboard:latest
```

→ Now visit [http://localhost:3001](http://localhost:3001) in your browser.

---

### 🔹 Option 2: Use `docker-compose` (recommended)

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: iptv
    volumes:
      - /volume1/docker/simple-iptv-dashboard/data:/var/lib/postgresql/data:rw
    ports:
      - '5432:5432'

  adminer:
    image: adminer
    restart: always
    ports:
      - '8080:8080'

  iptv-dashboard:
    image: ghcr.io/phantomargos/simple-iptv-dashboard:latest
    depends_on:
      - db
    environment:
      NODE_ENV: production
      PORT: 3001
      SESSION_SECRET: your-session-secret
      ENCRYPTION_SECRET: yourencryptionsecret
      DATABASE_URL: postgresql://admin:admin@db:5432/iptv
      ADMIN_USER: admin
      ADMIN_PASSWORD: admin
    ports:
      - '3001:3001'
    restart: always
```

Default credentials:

- **PostgreSQL**: `admin / admin`
- **Adminer**: [http://localhost:8080](http://localhost:8080), DB: `iptv`
- **Dashboard UI**: [http://localhost:3001](http://localhost:3001)

🗂️ Data will persist across restarts using a Docker volume.

---

## 🧑‍💻 Developer Setup

### 🧱 Project Structure

```
Simple-IPTV-Dashboard/
├── backend/       → Express + Prisma (TypeScript)
├── frontend/      → React + Vite + TailwindCSS
├── docker-compose.yml
└── README.md
```

### 📦 Requirements

- Node.js ≥ 18
- Docker (for database)
- PostgreSQL locally **or** via Docker

---

### ▶️ 1. Start database via Docker

```bash
docker-compose up -d db
```

Adminer will also be available at: [http://localhost:8080](http://localhost:8080)

---

### ▶️ 2. Start the backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/iptv"
SESSION_SECRET="supersecret"
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

Start the server:

```bash
npm run dev
```

---

### ▶️ 3. Start the frontend

```bash
cd ../frontend
npm install
npm run dev
```

App is now accessible at: [http://localhost:5173](http://localhost:5173)

---

### 📡 Xtream Codes API

The system automatically fetches account data from the Xtream API on each `/accounts` request:

```
http://{host}:{port}/player_api.php?username={user}&password={pass}
```

Extracted fields:

- `status`
- `exp_date`
- `active_cons`
- `max_connections`

---

## ✅ Features

- Provider & account creation via web form
- Automatic API sync for IPTV credentials
- Responsive
- REST API with session-based auth scaffold
- Internationalization (i18n)

---

## 📦 Release & CI/CD

- Releases are managed via [semantic-release](https://github.com/semantic-release/semantic-release)
- Docker images are automatically published to GHCR on each release:
  ```
  ghcr.io/phantomargos/simple-iptv-dashboard:latest
  ghcr.io/phantomargos/simple-iptv-dashboard:vX.Y.Z
  ```

---

## 🛠️ License

MIT – free to use, modify, and share.

---

_This project is not affiliated with or endorsed by Xtream Codes._
