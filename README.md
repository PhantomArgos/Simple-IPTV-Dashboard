# Simple IPTV Dashboard

Ein Fullstack-Projekt zum Verwalten von IPTV-Accounts mit automatischer API-Abfrage für Ablaufdatum und aktive Verbindungen.

## 🔧 Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Express + Prisma (TypeScript)
- **Datenbank:** PostgreSQL (Docker)
- **API-Integration:** Xtream Codes API

## 📁 Struktur

```
iptv-dashboard/
├── backend/       → Express + Prisma API
├── frontend/      → React Dashboard UI
├── docker-compose.yml
└── README.md
```

---

## 🚀 Setup

### 1. Repository entpacken & öffnen

```bash
unzip simple-iptv-dashboard.zip
cd iptv-dashboard
```

---

### 2. Datenbank starten (Docker)

```bash
docker-compose up -d
```

- PostgreSQL läuft auf `localhost:5432`
- Adminer läuft auf `http://localhost:8080` (Login: `admin` / `admin`, DB: `iptv`)

---

### 3. Backend aufsetzen

```bash
cd backend
npm install
```

- `.env` anlegen:
```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/iptv"
```

- Migration ausführen:
```bash
npx prisma migrate dev --name init
```

- Backend starten:
```bash
npm run dev
```

API-Endpunkte:
- `GET /providers`, `POST /providers`
- `GET /accounts`, `POST /accounts`  
  → beim Laden von Accounts werden Ablaufdatum & aktive Verbindungen automatisch per API aktualisiert.

---

### 4. Frontend aufsetzen

```bash
cd ../frontend
npm install
```

Tailwind initialisieren (falls noch nicht geschehen):

```bash
npx tailwindcss init -p
```

- Frontend starten:
```bash
npm run dev
```

Zugänglich unter: [http://localhost:5173](http://localhost:5173)

---

### 5. API für Xtream-Daten

Die API-Abfrage erfolgt automatisch über:

```http
http://{domain}:{port}/player_api.php?username={user}&password={pass}
```

Benötigte Felder aus der Antwort:
- `status`
- `exp_date`
- `active_cons`
- `max_connections`

Diese werden bei jedem `GET /accounts` Request aktualisiert.

---

## ✅ Features

- Übersicht aller Accounts inkl. Ablauf & Verbindungen
- Formulare zum Anlegen von Providern und Accounts
- Darkmode-fähiges UI mit Tailwind

---

## 🔮 ToDo / Erweiterungen

- Seiten-Routing
- Darkmode Toggle
- Authentifizierung
- Mehr Details / Statistiken je Account
