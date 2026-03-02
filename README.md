<div align="center">

# TechLearning

### Academic Files & Projects Journey

<br/>

A fullstack web platform to organize, upload and manage academic projects.
Dark neon cyberpunk theme. Support for PDFs, documents, videos, images, code, and any file type.

<br/>

  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=plastic" />

<br/><br/>

---

### Production Links

| Service | URL |
|:---:|:---:|
| **Frontend** | [adaptable-unity-production.up.railway.app](https://adaptable-unity-production.up.railway.app) |
| **Backend API** | [techlearningfiles-production.up.railway.app/api](https://techlearningfiles-production.up.railway.app/api) |
| **API Docs (Swagger)** | [techlearningfiles-production.up.railway.app/api/docs](https://techlearningfiles-production.up.railway.app/api/docs) |

---

### Table of Contents

[Features](#features) --
[Tech Stack](#tech-stack) --
[Architecture](#architecture) --
[Project Structure](#project-structure) --
[Local Development](#local-development) --
[Environment Variables](#environment-variables) --
[Database](#database) --
[API Endpoints](#api-endpoints) --
[Security](#security) --
[Deploy on Railway](#deploy-on-railway) --
[File Persistence](#file-persistence) --
[Troubleshooting](#troubleshooting)

---

## Features

<br/>

#### File Management

Upload files (PDFs, Word docs, videos, images, code, presentations) up to **1GB** each, 20 at once<br/>
Google Drive-style grid view with thumbnails for images and Lucide icons by file type<br/>
In-page file preview for **all file types**: images, video, audio, PDF, code/text (syntax viewer), Office docs (Google Docs Viewer), and download fallback<br/>
Rename files with a custom display name without changing the physical file<br/>
Filter by type (PDF, image, video, document, code, etc.) and sort by date, name, size, or type<br/>
Context menu to download, rename, or delete files

<br/>

#### Projects

Organize files by academic project with category, subject, semester, and tags<br/>
Public/private visibility toggle per project<br/>
Pin favorite projects to the top of the dashboard<br/>
Search and filter projects by name, subject, or category

<br/>

#### Profiles & Social

Public user profiles with avatar, banner, and bio<br/>
Settings page to edit name, bio, avatar, banner, and cover image<br/>
Social links: GitHub, LinkedIn, Twitter/X, personal website<br/>
Explore page to discover public projects from other users

<br/>

#### Interface

Dark neon theme (#0a0a0a background, #64ffda cyan accent, gradients, cyberpunk aesthetic)<br/>
Press Start 2P (headings) + Inter (body) fonts<br/>
Fully responsive: mobile, tablet, and desktop<br/>
Lucide icons throughout -- no emojis

<br/>

#### Platform

Dashboard with project and file statistics<br/>
Authentication with JWT + NextAuth<br/>
Security: Helmet, DOMPurify (XSS sanitization), input validation<br/>
Swagger UI API documentation at `/api/docs`<br/>
Persistent file storage via Railway Volumes (UPLOAD_DIR)

---

## Tech Stack

| Component | Technology |
|:---:|:---:|
| **Frontend** | Next.js 14 (App Router) |
| **Backend** | NestJS 10 |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js + JWT (Passport) |
| **Styles** | Tailwind CSS 3.4 |
| **Icons** | Lucide React |
| **Security** | Helmet + DOMPurify (isomorphic) |
| **Upload** | Multer (disk + Railway Volume) |
| **API Docs** | Swagger (OpenAPI) |
| **Deploy** | Railway (Docker multi-stage) |
| **Language** | TypeScript |

---

## Architecture

</div>

```
  Frontend (:3000)          Backend (:4000)           Database
 +-----------------+      +------------------+      +-------------+
 |                 |      |                  |      |             |
 |  Next.js 14     |----->|  NestJS API      |----->| PostgreSQL  |
 |  NextAuth       | HTTP |  JWT Auth        |Prisma|             |
 |  TailwindCSS    |      |  Helmet          |      +-------------+
 |  DOMPurify      |      |  Multer Upload   |
 |  Lucide Icons   |      |  Swagger Docs    |      +-------------+
 |  React Dropzone |      |  Static Assets   |----->| Volume      |
 |                 |      |                  | R/W  | /data/uploads|
 +-----------------+      +------------------+      +-------------+
```

<div align="center">

---

## Project Structure

</div>

```
TechLearningFiles/
+-- backend/                        NestJS API
|   +-- prisma/
|   |   +-- schema.prisma           Database schema
|   |   +-- migrations/             SQL migrations
|   +-- src/
|   |   +-- auth/                   Auth (JWT + Passport)
|   |   +-- users/                  User management (avatar, banner, profile)
|   |   +-- projects/               Project CRUD
|   |   +-- files/                  File upload and management
|   |   +-- prisma/                 Prisma service
|   |   +-- main.ts                 Entry point (0.0.0.0, static assets)
|   +-- uploads/                    Uploaded files (gitignored)
|   +-- Dockerfile                  node:20-slim multi-stage + OpenSSL
|   +-- package.json
|
+-- frontend/                       Next.js App
|   +-- src/
|   |   +-- app/
|   |   |   +-- auth/               Login and Register
|   |   |   +-- dashboard/          Dashboard, projects, profile, settings
|   |   |   +-- explore/            Public project discovery
|   |   |   +-- profile/            Public user profiles
|   |   |   +-- project/            Public project view
|   |   +-- components/
|   |   |   +-- FileList.tsx         Google Drive-style file grid
|   |   |   +-- FilePreview.tsx      In-page file preview modal (all types)
|   |   |   +-- FileUploader.tsx     Drag and drop upload (up to 1GB)
|   |   |   +-- Navbar.tsx           Navigation bar
|   |   |   +-- ProjectCard.tsx      Project card component
|   |   +-- lib/
|   |       +-- api.ts               API client (axios)
|   |       +-- sanitize.ts          DOMPurify utilities
|   |       +-- utils.ts             Helpers (icons, formatting)
|   +-- Dockerfile                   node:20-alpine
|   +-- package.json
|
+-- railway.toml                     Railway deploy config
+-- README.md
```

<div align="center">

---

## Local Development

<br/>

#### Prerequisites

Node.js 18+ (recommended 20) -- PostgreSQL 14+ (local or remote) -- npm

<br/>

#### 1. Clone the repository

</div>

```bash
git clone https://github.com/WakandianShield/TechLearningFiles.git
cd TechLearningFiles
```

<div align="center">

#### 2. Set up and start the Backend

</div>

```bash
cd backend
npm install
cp .env.example .env
```

<div align="center">

Edit `backend/.env`:

</div>

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/techlearning"
JWT_SECRET="any-secret-key"
JWT_EXPIRATION="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=1073741824
```

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

<div align="center">

Backend at **http://localhost:4000** -- Swagger at **http://localhost:4000/api/docs**

<br/>

#### 3. Set up and start the Frontend

</div>

```bash
cd frontend
npm install
cp .env.example .env.local
```

<div align="center">

Edit `frontend/.env.local`:

</div>

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-secret-key-local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

<div align="center">

Frontend at **http://localhost:3000**

<br/>

#### 4. Daily development

</div>

```bash
# Terminal 1 -- Backend (hot reload)
cd backend && npm run start:dev

# Terminal 2 -- Frontend (hot reload)
cd frontend && npm run dev
```

<div align="center">

#### Useful commands

</div>

```bash
# Visual database browser
cd backend && npx prisma studio

# New migration after changing schema.prisma
cd backend && npx prisma migrate dev --name description-of-change

# Regenerate Prisma Client
cd backend && npx prisma generate
```

<div align="center">

---

## Environment Variables

<br/>

#### Backend (backend/.env)

| Variable | Description | Local | Production |
|:---:|:---:|:---:|:---:|
| `DATABASE_URL` | PostgreSQL URL | `postgresql://postgres:pass@localhost:5432/techlearning` | Injected by Railway |
| `JWT_SECRET` | JWT signing key | any string | secure random string |
| `JWT_EXPIRATION` | Token expiry | `7d` | `7d` |
| `PORT` | Server port | `4000` | `4000` |
| `FRONTEND_URL` | Frontend URL (CORS) | `http://localhost:3000` | `https://adaptable-unity-production.up.railway.app` |
| `UPLOAD_DIR` | Upload directory | `./uploads` | `/data/uploads` (Railway Volume) |
| `MAX_FILE_SIZE` | Max file size (bytes) | `1073741824` | `1073741824` |

<br/>

#### Frontend (frontend/.env.local)

| Variable | Description | Local | Production |
|:---:|:---:|:---:|:---:|
| `NEXTAUTH_URL` | Frontend base URL | `http://localhost:3000` | `https://adaptable-unity-production.up.railway.app` |
| `NEXTAUTH_SECRET` | NextAuth secret | any string | secure random string |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000/api` | `https://techlearningfiles-production.up.railway.app/api` |

---

## Database

<br/>

#### User

| Field | Type | Description |
|:---:|:---:|:---:|
| id | String (CUID) | Unique ID |
| email | String | Email (unique) |
| name | String | Full name |
| password | String | bcrypt hash |
| avatar | String? | Avatar path (/uploads/...) |
| banner | String? | Banner path (/uploads/...) |
| bio | String? | Bio |
| website | String? | Personal website |
| socialLinks | Json? | Social links (github, linkedin, twitter) |

<br/>

#### Project

| Field | Type | Description |
|:---:|:---:|:---:|
| id | String (CUID) | Unique ID |
| title | String | Project title |
| slug | String | URL-friendly slug (unique) |
| description | String? | Description |
| category | ProjectCategory | PROGRAMMING, MATH, SCIENCE, etc. |
| visibility | ProjectVisibility | PUBLIC or PRIVATE |
| tags | String[] | Tags |
| semester | String? | Academic semester |
| subject | String? | Subject / course |
| coverImage | String? | Cover image |
| pinned | Boolean | Pinned to dashboard |
| authorId | String | FK to User |

<br/>

#### ProjectFile

| Field | Type | Description |
|:---:|:---:|:---:|
| id | String (CUID) | Unique ID |
| originalName | String | Original file name |
| displayName | String? | Custom display name |
| fileName | String | UUID name on disk |
| filePath | String | Access path (/uploads/...) |
| mimeType | String | MIME type |
| size | Int | Size in bytes |
| fileType | FileType | PDF, IMAGE, VIDEO, DOCUMENT, etc. |
| description | String? | Description |
| projectId | String | FK to Project |

<br/>

#### Enums

**ProjectCategory**: PROGRAMMING, MATH, SCIENCE, DESIGN, WRITING, RESEARCH, PRESENTATION, LAB, OTHER<br/>
**ProjectVisibility**: PUBLIC, PRIVATE<br/>
**FileType**: PDF, DOCUMENT, IMAGE, VIDEO, AUDIO, CODE, SPREADSHEET, ARCHIVE, OTHER

---

## API Endpoints

<br/>

#### Auth

| Method | Route | Description |
|:---:|:---:|:---:|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (auth) |

<br/>

#### Projects

| Method | Route | Description |
|:---:|:---:|:---:|
| GET | `/api/projects` | List user projects (auth) |
| GET | `/api/projects/stats` | Statistics (auth) |
| GET | `/api/projects/explore` | Public projects (public) |
| GET | `/api/projects/public/:id` | Public project detail (public) |
| GET | `/api/projects/:id` | Project detail (auth) |
| POST | `/api/projects` | Create project (auth) |
| PUT | `/api/projects/:id` | Update project (auth) |
| DELETE | `/api/projects/:id` | Delete project (auth) |
| PATCH | `/api/projects/:id/pin` | Toggle pin (auth) |

<br/>

#### Files

| Method | Route | Description |
|:---:|:---:|:---:|
| POST | `/api/files/upload/:projectId` | Upload files (auth) |
| GET | `/api/files/project/:projectId` | Project files (auth) |
| GET | `/api/files/:id` | File detail (auth) |
| PATCH | `/api/files/:id/rename` | Rename file (auth) |
| DELETE | `/api/files/:id` | Delete file (auth) |

<br/>

#### Users

| Method | Route | Description |
|:---:|:---:|:---:|
| GET | `/api/users/profile` | Own profile (auth) |
| PUT | `/api/users/profile` | Update profile (auth) |
| POST | `/api/users/avatar` | Upload avatar (auth) |
| POST | `/api/users/banner` | Upload banner (auth) |
| GET | `/api/users/search` | Search users (public) |
| GET | `/api/users/:id/public` | Public user profile (public) |
| GET | `/api/users/:id/projects` | User public projects (public) |

*(auth) = Requires header: Authorization: Bearer &lt;token&gt;*

---

## Security

<br/>

#### Backend (NestJS)

Helmet -- HTTP security headers with crossOriginResourcePolicy: cross-origin<br/>
CORS -- Only authorized origins (local frontend + production)<br/>
bcrypt -- Password hashing with salt rounds = 12<br/>
JWT -- Signed tokens with configurable expiration<br/>
ValidationPipe -- Automatic DTO validation (class-validator)<br/>
Whitelist -- Only fields defined in DTOs are accepted<br/>
Ownership checks -- Each resource verifies user ownership

<br/>

#### Frontend (Next.js)

DOMPurify -- Input sanitization against XSS (isomorphic)<br/>
CSP Headers -- Content-Security-Policy in next.config.js<br/>
NextAuth.js -- Secure session management<br/>
sanitizeText / sanitizeHtml -- Sanitization functions in lib/sanitize.ts

<br/>

#### Files

UUID filenames -- Prevent collisions and path traversal<br/>
Size limit -- 1GB per file (10MB for avatar/banner)<br/>
Count limit -- 20 files at once<br/>
MIME filtering -- Images only for avatar/banner

---

## Deploy on Railway

<br/>

#### Services

The project uses 3 Railway services:<br/>
**1.** PostgreSQL -- Database<br/>
**2.** Backend (Root Directory: backend) -- NestJS API with Dockerfile<br/>
**3.** Frontend (Root Directory: frontend) -- Next.js with Dockerfile

<br/>

#### Backend Configuration

Root Directory: `backend` -- Builder: Dockerfile -- Custom Start Command: (empty)

</div>

```
DATABASE_URL=postgresql://...@postgres.railway.internal:5432/railway
JWT_SECRET=<secure-secret-key>
JWT_EXPIRATION=7d
PORT=4000
FRONTEND_URL=https://adaptable-unity-production.up.railway.app
UPLOAD_DIR=/data/uploads
MAX_FILE_SIZE=1073741824
```

<div align="center">

#### Frontend Configuration

Root Directory: `frontend` -- Builder: Dockerfile

</div>

```
NEXTAUTH_URL=https://adaptable-unity-production.up.railway.app
NEXTAUTH_SECRET=<another-secret-key>
NEXT_PUBLIC_API_URL=https://techlearningfiles-production.up.railway.app/api
```

<div align="center">

#### Networking

Each service needs a public domain:<br/>
Backend: Settings > Networking > Generate Domain<br/>
Frontend: Settings > Networking > Generate Domain

---

## File Persistence

**Railway uses an ephemeral filesystem.**<br/>
Files are lost on every redeploy unless you set up a **Railway Volume**.

<br/>

#### How to set up a Railway Volume (REQUIRED)

**1.** Go to Railway Dashboard > Backend service > Settings > Volumes<br/>
**2.** Click **Add Volume**<br/>
**3.** Mount Path: `/data/uploads`<br/>
**4.** Size: 1 GB (or more as needed)<br/>
**5.** Save and wait for redeploy

<br/>

The Dockerfile sets `ENV UPLOAD_DIR=/data/uploads` by default.<br/>
When you create the volume at `/data/uploads`, files will automatically persist<br/>
across deploys, restarts, and code pushes. No env var override needed.

<br/>

**Without the volume, all uploaded files (project files, avatars, banners) will be lost on every deploy.**

<br/>

#### About Prisma Shadow Database

The `DROP DATABASE IF EXISTS "prisma_migrate_shadow_db_..."` message<br/>
comes from `prisma migrate dev` in **local development only**.<br/>
In production, the Dockerfile uses `prisma migrate deploy` which does **NOT** create<br/>
shadow databases and does **NOT** interfere with your uploaded files.<br/>
Files are stored on disk (Railway Volume), completely separate from the database.<br/>
The shadow database is temporary and only exists during local `migrate dev` execution.

---

## Supported File Formats

| Type | Extensions | Preview |
|:---:|:---:|:---:|
| PDF | .pdf | In-page iframe |
| Documents | .doc, .docx, .rtf | Google Docs Viewer |
| Images | .jpg, .png, .gif, .svg, .webp | Native image viewer |
| Videos | .mp4, .mov, .avi, .mkv | Native video player |
| Audio | .mp3, .wav, .ogg | Native audio player |
| Code | .js, .ts, .py, .java, .html, .css, .json, .xml | Syntax text viewer |
| Spreadsheets | .xlsx, .csv | Google Docs Viewer |
| Presentations | .pptx, .ppt | Google Docs Viewer |
| Archives | .zip, .rar, .tar.gz, .7z | Download only |
| Other | any format | Download only |

---

## Troubleshooting

<br/>

#### "Application failed to respond" on Railway

Verify the service listens on `0.0.0.0` (not localhost)<br/>
Verify environment variables are configured in Railway (not just in local .env)<br/>
Check logs: Railway > Deployments > click deploy > Logs<br/>
Do not use Custom Start Command if the Dockerfile already has CMD

<br/>

#### Files return 404 after redeploy

**Cause:** Railway ephemeral filesystem deletes files on redeploy<br/>
**Fix:** Create a Railway Volume mounted at `/data/uploads`<br/>
See [File Persistence](#file-persistence) section

<br/>

#### CORS error

Verify `FRONTEND_URL` in the backend uses `https://` and points to the correct domain<br/>
The backend allows origins configured in main.ts

<br/>

#### Prisma "No migration found"

Migration files must be in the repo: `backend/prisma/migrations/`<br/>
Generate locally: `npx prisma migrate dev --name name`<br/>
Commit and push the `migrations/` folder

<br/>

#### Prisma OpenSSL error in Docker

Use `node:20-slim` instead of `node:20-alpine`<br/>
Install OpenSSL: `RUN apt-get update -y && apt-get install -y openssl`

<br/>

#### Avatar or banner not displaying

Verify the URL is `${BACKEND_URL}/uploads/uuid.ext` (without `/api` in the middle)<br/>
The avatar and banner fields store paths as `/uploads/uuid.ext`

<br/>

#### Prisma shadow database message

The `DROP DATABASE IF EXISTS "prisma_migrate_shadow_db_..."` is completely normal<br/>
during local `prisma migrate dev`. It does not affect production or file storage.<br/>
In production only `prisma migrate deploy` runs, which does not use shadow databases.

---

Personal/academic project by [@WakandianShield](https://github.com/WakandianShield)

</div>
