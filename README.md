# TechLearning - Academic Files Journey

> Plataforma web para organizar, subir y gestionar todos tus proyectos académicos en un solo lugar. PDFs, documentos, videos, fotos, código y cualquier tipo de archivo.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway)

### Links de Producción

| Servicio | URL |
|---|---|
| **Frontend** | [adaptable-unity-production.up.railway.app](https://adaptable-unity-production.up.railway.app) |
| **Backend API** | [techlearningfiles-production.up.railway.app/api](https://techlearningfiles-production.up.railway.app/api) |
| **API Docs (Swagger)** | [techlearningfiles-production.up.railway.app/api/docs](https://techlearningfiles-production.up.railway.app/api/docs) |

---

## Tabla de Contenidos

- [Características](#características)
- [Tech Stack](#tech-stack)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo Local](#desarrollo-local)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Seguridad](#seguridad)
- [Deploy en Railway](#deploy-en-railway)
- [Troubleshooting](#troubleshooting)

---

## Características

- **Subida de archivos** — PDFs, documentos Word, videos, fotos, código, presentaciones y más (hasta 100MB por archivo, 20 simultáneos)
- **Organización por proyecto** — Agrupa archivos por proyecto académico con categoría, materia, semestre y tags
- **Búsqueda y filtrado** — Busca proyectos por nombre, materia, categoría
- **Proyectos favoritos** — Fija los proyectos más importantes
- **Dashboard** — Vista general con estadísticas de tus proyectos y archivos
- **Autenticación** — Registro e inicio de sesión con JWT + NextAuth
- **Seguridad** — Helmet, DOMPurify (sanitización XSS), validación de inputs
- **Responsive** — Interfaz adaptable a móvil, tablet y desktop
- **API documentada** — Swagger UI en `/api/docs`

---

## Tech Stack

| Componente | Tecnología |
|---|---|
| **Frontend** | Next.js 14 (App Router) |
| **Backend** | NestJS 10 |
| **Base de Datos** | PostgreSQL + Prisma ORM |
| **Autenticación** | NextAuth.js + JWT (Passport) |
| **Estilos** | Tailwind CSS 3.4 |
| **Seguridad** | Helmet + DOMPurify (isomorphic) |
| **Upload** | Multer (disk storage) |
| **Documentación API** | Swagger (OpenAPI) |
| **Deploy** | Railway (Docker) |
| **Lenguaje** | TypeScript |

---

## Arquitectura

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│                  │      │                  │      │              │
│   Next.js 14     │─────▶│   NestJS API     │─────▶│  PostgreSQL  │
│   (Frontend)     │ HTTP │   (Backend)      │Prisma│  (Database)  │
│                  │      │                  │      │              │
│  - NextAuth      │      │  - JWT Auth      │      │              │
│  - TailwindCSS   │      │  - Helmet        │      │              │
│  - DOMPurify     │      │  - Multer Upload │      │              │
│  - React Dropzone│      │  - Swagger Docs  │      │              │
│                  │      │                  │      │              │
└─────────────────┘      └──────────────────┘      └──────────────┘
     :3000                     :4000
```

---

## Estructura del Proyecto

```
TechLearningFiles/
├── backend/                      # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma         # Esquema de base de datos
│   │   └── migrations/           # Migraciones SQL
│   ├── src/
│   │   ├── auth/                 # Autenticación (JWT + Passport)
│   │   ├── users/                # Gestión de usuarios
│   │   ├── projects/             # CRUD de proyectos
│   │   ├── files/                # Upload y gestión de archivos
│   │   ├── prisma/               # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts              # Entry point (listen 0.0.0.0)
│   ├── uploads/                  # Archivos subidos (gitignored)
│   ├── Dockerfile                # node:20-slim + OpenSSL
│   ├── package.json
│   └── .env.example
│
├── frontend/                     # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/auth/[...nextauth]/route.ts
│   │   │   ├── auth/             # Login y Register
│   │   │   ├── dashboard/        # Dashboard, proyectos, perfil
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          # Landing page
│   │   ├── components/           # Componentes reutilizables
│   │   └── lib/
│   │       ├── api.ts            # Cliente API (axios)
│   │       ├── sanitize.ts       # DOMPurify utils
│   │       └── utils.ts          # Helpers
│   ├── Dockerfile                # node:20-alpine
│   ├── package.json
│   └── .env.example
│
├── railway.toml                  # Railway deploy config
└── README.md
```

---

## Desarrollo Local

### Requisitos previos

- **Node.js** 18+ (recomendado 20)
- **PostgreSQL** 14+ (local o remota)
- **npm**

### Opción A: Con PostgreSQL local

Si tienes PostgreSQL instalado, crea una base de datos:

```sql
CREATE DATABASE techlearning;
```

### Opción B: Usando la DB de Railway (recomendado para empezar rápido)

Usa la URL pública de tu base de datos de Railway. La encuentras en Railway → PostgreSQL → Connect → Public URL.

### 1. Clonar el repositorio

```bash
git clone https://github.com/WakandianShield/TechLearningFiles.git
cd TechLearningFiles
```

### 2. Configurar y levantar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

Edita `backend/.env` con tus valores:

```env
# Si usas PostgreSQL local:
DATABASE_URL="postgresql://postgres:tu-password@localhost:5432/techlearning"

# Si usas la DB de Railway (URL pública):
DATABASE_URL="postgresql://postgres:fwtKGAaPLuNSxrSeTsyNprFNDTylLsAo@interchange.proxy.rlwy.net:24722/railway"

JWT_SECRET="una-clave-secreta-cualquiera"
JWT_EXPIRATION="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=104857600
```

```bash
# Generar Prisma Client
npx prisma generate

# Crear tablas en la base de datos
npx prisma migrate dev --name init

# Iniciar en modo desarrollo (hot reload)
npm run start:dev
```

El backend estará en **http://localhost:4000**  
Swagger docs en **http://localhost:4000/api/docs**

### 3. Configurar y levantar el Frontend

Abre **otra terminal**:

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local
```

Edita `frontend/.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=cualquier-clave-secreta-local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
# Iniciar en modo desarrollo (hot reload)
npm run dev
```

El frontend estará en **http://localhost:3000**

### 4. Desarrollo día a día

Una vez configurado, solo necesitas abrir dos terminales:

```bash
# Terminal 1 — Backend (hot reload automático)
cd backend && npm run start:dev

# Terminal 2 — Frontend (hot reload automático)
cd frontend && npm run dev
```

Los cambios se reflejan automáticamente sin necesidad de hacer push. Solo haz push cuando quieras actualizar producción.

### Comandos útiles

```bash
# Ver la base de datos con interfaz visual
cd backend && npx prisma studio

# Crear nueva migración después de cambiar schema.prisma
cd backend && npx prisma migrate dev --name descripcion-del-cambio

# Regenerar Prisma Client
cd backend && npx prisma generate

# Lint del frontend
cd frontend && npm run lint
```

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Local | Producción |
|---|---|---|---|
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://postgres:pass@localhost:5432/techlearning` | `postgresql://...@postgres.railway.internal:5432/railway` |
| `JWT_SECRET` | Clave secreta para JWT | cualquier string | string seguro y aleatorio |
| `JWT_EXPIRATION` | Expiración del token | `7d` | `7d` |
| `PORT` | Puerto del servidor | `4000` | `4000` |
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:3000` | `https://adaptable-unity-production.up.railway.app` |
| `UPLOAD_DIR` | Directorio de uploads | `./uploads` | `./uploads` |
| `MAX_FILE_SIZE` | Tamaño máximo (bytes) | `104857600` | `104857600` |

### Frontend (`frontend/.env.local`)

| Variable | Descripción | Local | Producción |
|---|---|---|---|
| `NEXTAUTH_URL` | URL base del frontend | `http://localhost:3000` | `https://adaptable-unity-production.up.railway.app` |
| `NEXTAUTH_SECRET` | Clave secreta NextAuth | cualquier string | string seguro y aleatorio |
| `NEXT_PUBLIC_API_URL` | URL del API backend | `http://localhost:4000/api` | `https://techlearningfiles-production.up.railway.app/api` |

---

## Base de Datos

### Modelos

#### User
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (CUID) | ID único |
| email | String | Email (único) |
| name | String | Nombre completo |
| password | String | Hash bcrypt |
| bio | String? | Biografía |
| avatar | String? | URL avatar |

#### Project
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (CUID) | ID único |
| title | String | Título del proyecto |
| slug | String | URL amigable (único) |
| description | String? | Descripción |
| category | ProjectCategory | PROGRAMMING, MATH, SCIENCE, etc. |
| tags | String[] | Etiquetas |
| semester | String? | Semestre académico |
| subject | String? | Materia/asignatura |
| pinned | Boolean | Fijado como favorito |
| authorId | String | FK → User |

#### ProjectFile
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (CUID) | ID único |
| originalName | String | Nombre original del archivo |
| fileName | String | Nombre UUID en disco |
| filePath | String | Ruta de acceso |
| mimeType | String | Tipo MIME |
| size | Int | Tamaño en bytes |
| fileType | FileType | PDF, IMAGE, VIDEO, DOCUMENT, etc. |
| description | String? | Descripción |
| projectId | String | FK → Project |

### Enums

**ProjectCategory**: `PROGRAMMING`, `MATH`, `SCIENCE`, `DESIGN`, `WRITING`, `RESEARCH`, `PRESENTATION`, `LAB`, `OTHER`

**FileType**: `PDF`, `DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `CODE`, `SPREADSHEET`, `ARCHIVE`, `OTHER`

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Usuario actual (🔒) |

### Projects
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/projects` | Listar proyectos (🔒) |
| GET | `/api/projects/stats` | Estadísticas (🔒) |
| GET | `/api/projects/:id` | Detalle de proyecto (🔒) |
| POST | `/api/projects` | Crear proyecto (🔒) |
| PUT | `/api/projects/:id` | Actualizar proyecto (🔒) |
| DELETE | `/api/projects/:id` | Eliminar proyecto (🔒) |
| PATCH | `/api/projects/:id/pin` | Toggle pin (🔒) |

### Files
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/files/upload/:projectId` | Subir archivos (🔒) |
| GET | `/api/files/project/:projectId` | Archivos de un proyecto (🔒) |
| GET | `/api/files/:id` | Detalle de archivo (🔒) |
| DELETE | `/api/files/:id` | Eliminar archivo (🔒) |

### Users
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users/profile` | Ver perfil (🔒) |
| PUT | `/api/users/profile` | Actualizar perfil (🔒) |

> 🔒 = Requiere autenticación (Header: `Authorization: Bearer <token>`)

---

## Seguridad

### Backend (NestJS)
- **Helmet** — Headers HTTP de seguridad
- **CORS** — Solo orígenes autorizados (frontend local + producción)
- **bcrypt** — Hashing de contraseñas con salt rounds = 12
- **JWT** — Tokens firmados con expiración configurable
- **ValidationPipe** — Validación automática de DTOs (class-validator)
- **Whitelist** — Solo se aceptan campos definidos en los DTOs
- **Ownership checks** — Cada recurso verifica que el usuario sea el propietario

### Frontend (Next.js)
- **DOMPurify** — Sanitización de inputs contra XSS
- **CSP Headers** — Content-Security-Policy en next.config.js
- **NextAuth.js** — Manejo seguro de sesiones
- **sanitizeText / sanitizeHtml** — Funciones de sanitización en `lib/sanitize.ts`

### Archivos
- **UUID filenames** — Nombres UUID para evitar colisiones y path traversal
- **Límite de tamaño** — 100MB por archivo
- **Límite de cantidad** — 20 archivos simultáneos

---

## Deploy en Railway

### Servicios en Railway

El proyecto usa 3 servicios en Railway:

1. **PostgreSQL** — Base de datos
2. **Backend** (Root Directory: `backend`) — NestJS API
3. **Frontend** (Root Directory: `frontend`) — Next.js App

### Configuración del Backend en Railway

**Settings:**
- Root Directory: `backend`
- Builder: Dockerfile (detectado automáticamente)
- Custom Start Command: _(dejar vacío, el Dockerfile maneja todo)_

**Variables:**
```
DATABASE_URL=postgresql://...@postgres.railway.internal:5432/railway
JWT_SECRET=<clave-secreta-segura>
JWT_EXPIRATION=7d
PORT=4000
FRONTEND_URL=https://adaptable-unity-production.up.railway.app
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
```

### Configuración del Frontend en Railway

**Settings:**
- Root Directory: `frontend`
- Builder: Dockerfile (detectado automáticamente)

**Variables:**
```
NEXTAUTH_URL=https://adaptable-unity-production.up.railway.app
NEXTAUTH_SECRET=<otra-clave-secreta>
NEXT_PUBLIC_API_URL=https://techlearningfiles-production.up.railway.app/api
```

### Networking

Cada servicio necesita un dominio público:
- Backend → Settings → Networking → Generate Domain
- Frontend → Settings → Networking → Generate Domain

### Notas importantes sobre Docker en Railway

- El backend usa `node:20-slim` (no Alpine) para compatibilidad con Prisma/OpenSSL
- El frontend usa `next start -H 0.0.0.0` para aceptar tráfico externo
- El backend escucha en `0.0.0.0` (`app.listen(port, '0.0.0.0')`)
- Las migraciones de Prisma se ejecutan automáticamente al iniciar el contenedor
- **No** usar Custom Start Command si el Dockerfile ya tiene CMD definido
- Usa **Railway Volumes** si necesitas persistencia de archivos entre deploys

---

## Formatos de Archivos Soportados

| Tipo | Extensiones | Icono |
|---|---|---|
| PDF | .pdf | 📄 |
| Documentos | .doc, .docx, .txt, .rtf | 📝 |
| Imágenes | .jpg, .png, .gif, .svg, .webp | 🖼️ |
| Videos | .mp4, .mov, .avi, .mkv | 🎬 |
| Audio | .mp3, .wav, .ogg | 🎵 |
| Código | .js, .ts, .py, .java, .html, .css | 💻 |
| Hojas de cálculo | .xlsx, .csv | 📊 |
| Archivos comprimidos | .zip, .rar, .tar.gz | 📦 |
| Presentaciones | .pptx, .ppt | 📽️ |
| Otros | cualquier formato | 📎 |

---

## Troubleshooting

### "Application failed to respond" en Railway
- Verificar que el servicio escucha en `0.0.0.0` (no `localhost`)
- Verificar que las variables de entorno están configuradas en Railway (no solo en `.env` local)
- Revisar los logs de runtime en Railway → Deployments → click en deploy → Logs
- No usar Custom Start Command si el Dockerfile ya tiene CMD

### Error de CORS
- Verificar que `FRONTEND_URL` en el backend apunta al dominio correcto del frontend con `https://`
- El backend permite orígenes configurados en `main.ts`

### Prisma "No migration found"
- Los archivos de migración deben estar en el repo: `backend/prisma/migrations/`
- Generar migraciones localmente: `npx prisma migrate dev --name nombre`
- Hacer commit y push de la carpeta `migrations/`

### Prisma OpenSSL error en Docker
- Usar `node:20-slim` en vez de `node:20-alpine`
- Instalar OpenSSL: `RUN apt-get update -y && apt-get install -y openssl`

### npm ci falla en Docker
- Asegurar que `package-lock.json` está en el repo (no en `.gitignore`)
- Generar: `npm install --package-lock-only`

---

## Licencia

Este proyecto es de uso personal/académico. Creado por [@WakandianShield](https://github.com/WakandianShield).
