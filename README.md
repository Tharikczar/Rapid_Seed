# 🌱 RapidSeed

> A cloud-based torrent manager — add magnet links, download files in the cloud, and stream or access them from anywhere.

---

## 🚀 What is RapidSeed?

RapidSeed is a self-hosted cloud torrent platform inspired by [Seedr.cc](https://seedr.cc). Instead of downloading torrents directly to your device, RapidSeed fetches them in the cloud, stores them securely, and lets you stream or download files on demand — from any device, anywhere.

Built to demonstrate real-world backend engineering: async job queues, cloud storage, HTTP streaming, quota management, and AI-powered file intelligence.

---

## ✨ Features

- 🧲 **Add torrents via magnet link or .torrent file
**
- ☁️ **Cloud storage** — files stored on Cloudflare R2 (S3-compatible)
- 📡 **Real-time progress** — live download updates via Server-Sent Events (SSE)
- 🎬 **HTTP range streaming** — stream video files without full download
- 👤 **User auth** — JWT-based authentication with refresh tokens
- 📦 **Storage quota management** — per-user plan limits enforced at middleware level
- 🤖 **AI file intelligence** — auto-categorization, smart search, content tagging (powered by Claude API)
- 🔒 **Secure** — API keys encrypted, secrets via environment variables, rate limiting on all endpoints

---

## 🏗️ Architecture

```
Client Request
      │
      ▼
  NestJS API
  (Auth + Quota Guard)
      │
      ├──► MongoDB         ← users, torrent jobs, file metadata
      │
      ├──► BullMQ Queue    ← async torrent processing
      │         │
      │         ▼
      │    TorBox API      ← actual torrent fetching
      │         │
      │         ▼
      │    Cloudflare R2   ← file storage
      │
      ├──► Redis           ← queue backend + response caching
      │
      └──► Claude API      ← AI file categorization & search
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com) + TypeScript |
| Database | [MongoDB](https://mongodb.com) + [Mongoose](https://mongoosejs.com) |
| Job Queue | [BullMQ](https://bullmq.io) + Redis |
| File Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible) |
| Torrent Backend | [TorBox API](https://torbox.app) |
| Auth | JWT + Refresh Tokens |
| AI | [Claude API](https://anthropic.com) (Anthropic) |
| Streaming | HTTP Range Requests (RFC 7233) |
| Deployment | Docker + Docker Compose + Oracle Cloud (Always Free) |

---

## 📁 Project Structure

```
src/
├── auth/               # JWT auth, refresh tokens, guards
├── users/              # User schema, quota tracking
├── torrents/           # Core feature — add/list/delete torrents
├── files/              # File listing, range-request streaming
├── queue/              # BullMQ job processors
├── storage/            # Cloudflare R2 wrapper service
├── ai/                 # Claude API integration — tagging, search
├── stremio/            # Stremio addon integration (Phase 3)
│   ├── stremio.module.ts
│   ├── stremio.controller.ts   # /manifest.json, /stream/:id
│   └── stremio.service.ts      # Maps R2 files → Stremio stream format
└── common/
    ├── guards/         # JwtAuthGuard, QuotaGuard
    ├── interceptors/   # Logging interceptor
    └── filters/        # Global exception filter
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com) free tier)
- Redis
- Cloudflare R2 bucket
- TorBox account + API key
- Anthropic API key (for AI features)

### 1. Clone & Install

```bash
git clone https://github.com/Tharikczar/Rapid_Seed.git
cd Rapid_Seed
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/rapidseed

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# TorBox
TORBOX_API_KEY=your_torbox_api_key

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=rapidseed

# Anthropic (AI features)
ANTHROPIC_API_KEY=your_anthropic_key
```

### 3. Run with Docker Compose

```bash
docker-compose up -d
```

Or locally:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get JWT + refresh token |
| POST | `/auth/refresh` | Refresh access token |

### Torrents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/torrents` | Add torrent via magnet link |
| GET | `/torrents` | List all user torrents |
| GET | `/torrents/:id` | Get torrent status + progress |
| DELETE | `/torrents/:id` | Remove torrent and files |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files` | List user files |
| GET | `/files/:id/stream` | Stream file (supports Range header) |
| GET | `/files/:id/download` | Download file via signed R2 URL |
| DELETE | `/files/:id` | Delete file, free quota |

### SSE (Real-time Progress)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/torrents/:id/progress` | Stream download progress events |

### Stremio Addon *(Phase 3)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stremio/manifest.json` | Stremio addon manifest |
| GET | `/stremio/stream/:type/:id` | Resolve R2 file as Stremio stream |

---

## 🤖 AI Features

RapidSeed uses the **Claude API** to add intelligence on top of raw file storage:

- **Auto-categorization** — detects if a file is a movie, TV show (with season/episode), music, software, etc.
- **Natural language search** — search files with queries like *"action movies"* or *"season 2 episodes"*
- **Smart deduplication** — identifies similar files across uploads

---

## 🏗️ Engineering Highlights

### Async Job Queue
Torrent downloads are long-running tasks. Every add-torrent request creates a **BullMQ job** — no blocking the HTTP thread. Jobs persist across restarts and retry automatically on failure.

### HTTP Range Streaming
The `/stream` endpoint implements **RFC 7233 partial content** — clients can seek through videos without downloading the full file first, exactly like native streaming platforms.

### Quota Middleware
A custom `QuotaGuard` intercepts every upload/add request and checks the user's current storage usage against their plan limit — enforcing business logic at the infrastructure level, not the application level.

### Storage Abstraction
All R2 operations go through a single `StorageService` — making it trivial to swap to S3, GCS, or local disk without touching business logic.

### MongoDB Document Design
MongoDB's flexible document model is a natural fit here — file metadata, torrent status, and user quota are all document-shaped with no complex joins needed. Mongoose schemas enforce structure at the application layer while keeping the flexibility to evolve.

---

## 📺 Stremio Integration *(Planned — Phase 3)*

Once the core is complete, RapidSeed will expose a **Stremio addon endpoint** — turning your personal cloud storage into a private streaming library inside Stremio.

```
Stremio App
    │
    ▼
RapidSeed Stremio Addon (/stremio/stream/:id)
    │
    ▼
MongoDB  ←  looks up matching file by IMDB ID or filename
    │
    ▼
Cloudflare R2  ←  returns signed stream URL
    │
    ▼
Stremio plays it directly
```

Instead of relying on third-party addon servers that crash under load, your Stremio streams directly from your own R2 bucket — zero dependency on external services.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

---

## 🚢 Deployment

Deployed on **Oracle Cloud Always Free Tier** (Ubuntu VM) using Docker Compose with Nginx reverse proxy and Let's Encrypt SSL.

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🗺️ Roadmap

**Phase 1 — Core Backend**
- [x] NestJS + MongoDB + Mongoose setup
- [x] Project structure + ESLint + Prettier
- [ ] JWT auth with refresh tokens
- [ ] Torrent module (TorBox API integration)
- [ ] BullMQ job queue for async downloads
- [ ] Cloudflare R2 file storage
- [ ] HTTP range request streaming
- [ ] Storage quota management

**Phase 2 — Intelligence & Polish**
- [ ] AI file auto-categorization (Claude API)
- [ ] Natural language file search
- [ ] Real-time progress via SSE
- [ ] Webhook notifications on download complete
- [ ] Shareable file links with expiry

**Phase 3 — Stremio Integration**
- [ ] Stremio addon manifest endpoint
- [ ] Stream resolver — maps files to Stremio stream format
- [ ] IMDB ID matching for movies/shows
- [ ] Subtitle auto-fetch + translation (AI-powered)

**Phase 4 — Platform**
- [ ] Frontend dashboard (React)
- [ ] Multi-user admin panel
- [ ] Stripe billing (free / pro plans)
- [ ] Usage analytics

---

## 🤝 Contributing

Pull requests welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---

## 👤 Author

**Tharik** — Frontend engineer transitioning to backend, building real systems.

[GitHub](https://github.com/Tharikczar) · [LinkedIn](https://linkedin.com/in/yourprofile)