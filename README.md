<h1 align="center">TechLearning - Academic Files Journey</h1>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=plastic" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=plastic" />
</p>

<p align="center">
Plataforma web fullstack para organizar, subir y gestionar proyectos academicos. Tema oscuro neon con estetica cyberpunk. Soporte para PDFs, documentos, videos, imagenes, codigo y cualquier tipo de archivo.
</p>

### Links de Produccion

| Servicio | URL |
|---|---|
| **Frontend** | [adaptable-unity-production.up.railway.app](https://adaptable-unity-production.up.railway.app) |
| **Backend API** | [techlearningfiles-production.up.railway.app/api](https://techlearningfiles-production.up.railway.app/api) |
| **API Docs (Swagger)** | [techlearningfiles-production.up.railway.app/api/docs](https://techlearningfiles-production.up.railway.app/api/docs) |

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Tech Stack](#tech-stack)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Desarrollo Local](#desarrollo-local)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Seguridad](#seguridad)
- [Deploy en Railway](#deploy-en-railway)
- [Persistencia de Archivos](#persistencia-de-archivos)
- [Troubleshooting](#troubleshooting)

---

## Caracteristicas

### Gestion de Archivos
- **Subida de archivos** -- PDFs, documentos Word, videos, imagenes, codigo, presentaciones y mas (hasta 100MB por archivo, 20 simultaneos)
- **Vista de archivos estilo Google Drive** -- Grid responsivo con thumbnails para imagenes, iconos por tipo de archivo (Lucide icons)
- **Renombrar archivos** -- Nombre visual personalizable sin cambiar el archivo fisico
- **Filtrado por tipo** -- Filtra archivos por PDF, imagen, video, documento, codigo, etc.
- **Menu contextual** -- Click derecho o boton de opciones para descargar, renombrar o eliminar

### Proyectos
- **Organizacion por proyecto** -- Agrupa archivos por proyecto academico con categoria, materia, semestre y tags
- **Visibilidad publica/privada** -- Cada proyecto puede ser publico o privado
- **Proyectos favoritos (pin)** -- Fija los proyectos mas importantes en el dashboard
- **Busqueda y filtrado** -- Busca proyectos por nombre, materia, categoria

### Perfiles y Social
- **Perfiles publicos** -- Cada usuario tiene un perfil publico con avatar, banner y bio
- **Pagina de settings** -- Edita nombre, bio, avatar, banner e imagen de portada
- **Links sociales** -- GitHub, LinkedIn, Twitter/X, sitio web personal
- **Pagina Explore** -- Descubre proyectos publicos de otros usuarios

### Interfaz
- **Tema oscuro neon** -- Fondo oscuro (#0a0a0a), acento cyan (#64ffda), gradientes, estetica cyberpunk
- **Fuentes** -- Press Start 2P (titulos) + Inter (cuerpo)
- **Responsive** -- Adaptable a movil, tablet y desktop
- **Iconos Lucide** -- Iconografia consistente sin emojis

### Plataforma
- **Dashboard** -- Vista general con estadisticas de proyectos y archivos
- **Autenticacion** -- Registro e inicio de sesion con JWT + NextAuth
- **Seguridad** -- Helmet, DOMPurify (sanitizacion XSS), validacion de inputs
- **API documentada** -- Swagger UI en `/api/docs`
- **Almacenamiento persistente** -- Soporte para Railway Volumes via variable `UPLOAD_DIR`

---

## Tech Stack

| Componente | Tecnologia |
|---|---|
| **Frontend** | Next.js 14 (App Router) |
| **Backend** | NestJS 10 |
| **Base de Datos** | PostgreSQL + Prisma ORM |
| **Autenticacion** | NextAuth.js + JWT (Passport) |
| **Estilos** | Tailwind CSS 3.4 |
| **Iconos** | Lucide React |
| **Seguridad** | Helmet + DOMPurify (isomorphic) |
| **Upload** | Multer (disk storage, Railway Volume) |
| **Documentacion API** | Swagger (OpenAPI) |
| **Deploy** | Railway (Docker multi-stage) |
| **Lenguaje** | TypeScript |

---

## Arquitectura

```
┌──────────────────┐      ┌───────────────────┐      ┌──────────────┐
│                  │      │                   │      │              │
│   Next.js 14     │─────>│   NestJS API      │─────>│  PostgreSQL  │
│   (Frontend)     │ HTTP │   (Backend)       │Prisma│  (Database)  │
│                  │      │                   │      │              │
│  - NextAuth      │      │  - JWT Auth       │      └──────────────┘
│  - TailwindCSS   │      │  - Helmet         │
│  - DOMPurify     │      │  - Multer Upload  │      ┌──────────────┐
│  - Lucide Icons  │      │  - Swagger Docs   │─────>│   Volume     │
│  - React Dropzone│      │  - Static Assets  │ R/W  │  /data/uploads│
│                  │      │                   │      │  (persistent) │
└──────────────────┘      └───────────────────┘      └──────────────┘
     :3000                      :4000
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
│   │   ├── auth/                 # Autenticacion (JWT + Passport)
│   │   │   ├── dto/              # Login y Register DTOs
│   │   │   ├── jwt.strategy.ts   # Passport JWT strategy
│   │   │   └── jwt-auth.guard.ts # Guard de autenticacion
│   │   ├── users/                # Gestion de usuarios
│   │   │   ├── dto/              # Update profile DTO
│   │   │   └── users.controller  # Avatar, banner, perfil publico
│   │   ├── projects/             # CRUD de proyectos
│   │   │   └── dto/              # Create/Update project DTOs
│   │   ├── files/                # Upload y gestion de archivos
│   │   ├── prisma/               # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts              # Entry point (0.0.0.0, static assets)
│   ├── uploads/                  # Archivos subidos (gitignored)
│   ├── Dockerfile                # node:20-slim multi-stage + OpenSSL
│   └── package.json
│
├── frontend/                     # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/auth/[...nextauth]/route.ts
│   │   │   ├── auth/             # Login y Register
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx      # Dashboard principal
│   │   │   │   ├── projects/     # CRUD de proyectos + vista de archivos
│   │   │   │   └── profile/      # Perfil y settings del usuario
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          # Landing page (dark neon)
│   │   ├── components/
│   │   │   ├── FileList.tsx      # Grid de archivos estilo Google Drive
│   │   │   ├── FileUploader.tsx  # Drag & drop upload
│   │   │   ├── Navbar.tsx        # Barra de navegacion
│   │   │   ├── ProjectCard.tsx   # Tarjeta de proyecto
│   │   │   └── AuthProvider.tsx  # NextAuth provider
│   │   └── lib/
│   │       ├── api.ts            # Cliente API (axios)
│   │       ├── sanitize.ts       # DOMPurify utils
│   │       └── utils.ts          # Helpers (iconos, formato)
│   ├── Dockerfile                # node:20-alpine
│   └── package.json
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

### Opcion A: Con PostgreSQL local

```sql
CREATE DATABASE techlearning;
```

### Opcion B: Usando la DB de Railway

Usa la URL publica de tu base de datos de Railway. La encuentras en Railway > PostgreSQL > Connect > Public URL.

### 1. Clonar el repositorio

```bash
git clone https://github.com/WakandianShield/TechLearningFiles.git
cd TechLearningFiles
```

### 2. Configurar y levantar el Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:tu-password@localhost:5432/techlearning"
JWT_SECRET="una-clave-secreta-cualquiera"
JWT_EXPIRATION="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=104857600
```

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend en **http://localhost:4000** | Swagger en **http://localhost:4000/api/docs**

### 3. Configurar y levantar el Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edita `frontend/.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=cualquier-clave-secreta-local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

Frontend en **http://localhost:3000**

### 4. Desarrollo dia a dia

```bash
# Terminal 1 -- Backend
cd backend && npm run start:dev

# Terminal 2 -- Frontend
cd frontend && npm run dev
```

### Comandos utiles

```bash
# Interfaz visual de la base de datos
cd backend && npx prisma studio

# Nueva migracion tras cambiar schema.prisma
cd backend && npx prisma migrate dev --name descripcion-del-cambio

# Regenerar Prisma Client
cd backend && npx prisma generate

# Lint del frontend
cd frontend && npm run lint
```

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripcion | Local | Produccion |
|---|---|---|---|
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://postgres:pass@localhost:5432/techlearning` | Inyectada por Railway |
| `JWT_SECRET` | Clave secreta para JWT | cualquier string | string seguro y aleatorio |
| `JWT_EXPIRATION` | Expiracion del token | `7d` | `7d` |
| `PORT` | Puerto del servidor | `4000` | `4000` |
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:3000` | `https://adaptable-unity-production.up.railway.app` |
| `UPLOAD_DIR` | Directorio de uploads | `./uploads` | `/data/uploads` (Railway Volume) |
| `MAX_FILE_SIZE` | Tamano maximo (bytes) | `104857600` | `104857600` |

### Frontend (`frontend/.env.local`)

| Variable | Descripcion | Local | Produccion |
|---|---|---|---|
| `NEXTAUTH_URL` | URL base del frontend | `http://localhost:3000` | `https://adaptable-unity-production.up.railway.app` |
| `NEXTAUTH_SECRET` | Clave secreta NextAuth | cualquier string | string seguro y aleatorio |
| `NEXT_PUBLIC_API_URL` | URL del API backend | `http://localhost:4000/api` | `https://techlearningfiles-production.up.railway.app/api` |

---

## Base de Datos

### Modelos

#### User
| Campo | Tipo | Descripcion |
|---|---|---|
| id | String (CUID) | ID unico |
| email | String | Email (unico) |
| name | String | Nombre completo |
| password | String | Hash bcrypt |
| avatar | String? | Ruta de avatar (/uploads/...) |
| banner | String? | Ruta de banner (/uploads/...) |
| bio | String? | Biografia |
| website | String? | Sitio web personal |
| socialLinks | Json? | Links sociales (github, linkedin, twitter) |
| createdAt | DateTime | Fecha de creacion |
| updatedAt | DateTime | Ultima actualizacion |

#### Project
| Campo | Tipo | Descripcion |
|---|---|---|
| id | String (CUID) | ID unico |
| title | String | Titulo del proyecto |
| slug | String | URL amigable (unico) |
| description | String? | Descripcion |
| category | ProjectCategory | PROGRAMMING, MATH, SCIENCE, etc. |
| visibility | ProjectVisibility | PUBLIC o PRIVATE |
| tags | String[] | Etiquetas |
| semester | String? | Semestre academico |
| subject | String? | Materia/asignatura |
| coverImage | String? | Imagen de portada |
| pinned | Boolean | Fijado como favorito |
| authorId | String | FK > User |
| createdAt | DateTime | Fecha de creacion |
| updatedAt | DateTime | Ultima actualizacion |

#### ProjectFile
| Campo | Tipo | Descripcion |
|---|---|---|
| id | String (CUID) | ID unico |
| originalName | String | Nombre original del archivo |
| displayName | String? | Nombre visual personalizado |
| fileName | String | Nombre UUID en disco |
| filePath | String | Ruta de acceso (/uploads/...) |
| mimeType | String | Tipo MIME |
| size | Int | Tamano en bytes |
| fileType | FileType | PDF, IMAGE, VIDEO, DOCUMENT, etc. |
| description | String? | Descripcion |
| projectId | String | FK > Project |
| createdAt | DateTime | Fecha de creacion |

### Enums

**ProjectCategory**: `PROGRAMMING`, `MATH`, `SCIENCE`, `DESIGN`, `WRITING`, `RESEARCH`, `PRESENTATION`, `LAB`, `OTHER`

**ProjectVisibility**: `PUBLIC`, `PRIVATE`

**FileType**: `PDF`, `DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `CODE`, `SPREADSHEET`, `ARCHIVE`, `OTHER`

---

## API Endpoints

### Auth
| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesion |
| GET | `/api/auth/me` | Usuario actual (auth) |

### Projects
| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/projects` | Listar proyectos del usuario (auth) |
| GET | `/api/projects/stats` | Estadisticas (auth) |
| GET | `/api/projects/explore` | Proyectos publicos (publico) |
| GET | `/api/projects/public/:id` | Detalle de proyecto publico (publico) |
| GET | `/api/projects/:id` | Detalle de proyecto (auth) |
| POST | `/api/projects` | Crear proyecto (auth) |
| PUT | `/api/projects/:id` | Actualizar proyecto (auth) |
| DELETE | `/api/projects/:id` | Eliminar proyecto (auth) |
| PATCH | `/api/projects/:id/pin` | Toggle pin (auth) |

### Files
| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/files/upload/:projectId` | Subir archivos (auth) |
| GET | `/api/files/project/:projectId` | Archivos de un proyecto (auth) |
| GET | `/api/files/:id` | Detalle de archivo (auth) |
| PATCH | `/api/files/:id/rename` | Renombrar archivo (auth) |
| DELETE | `/api/files/:id` | Eliminar archivo (auth) |

### Users
| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/users/profile` | Ver perfil propio (auth) |
| PUT | `/api/users/profile` | Actualizar perfil (auth) |
| POST | `/api/users/avatar` | Subir avatar (auth) |
| POST | `/api/users/banner` | Subir banner (auth) |
| GET | `/api/users/search` | Buscar usuarios (publico) |
| GET | `/api/users/:id/public` | Perfil publico de usuario (publico) |
| GET | `/api/users/:id/projects` | Proyectos publicos de usuario (publico) |

> (auth) = Requiere header `Authorization: Bearer <token>`

---

## Seguridad

### Backend (NestJS)
- **Helmet** -- Headers HTTP de seguridad con `crossOriginResourcePolicy: cross-origin`
- **CORS** -- Solo origenes autorizados (frontend local + produccion)
- **bcrypt** -- Hashing de contrasenas con salt rounds = 12
- **JWT** -- Tokens firmados con expiracion configurable
- **ValidationPipe** -- Validacion automatica de DTOs (class-validator)
- **Whitelist** -- Solo se aceptan campos definidos en los DTOs
- **Ownership checks** -- Cada recurso verifica que el usuario sea el propietario

### Frontend (Next.js)
- **DOMPurify** -- Sanitizacion de inputs contra XSS (isomorphic)
- **CSP Headers** -- Content-Security-Policy en next.config.js
- **NextAuth.js** -- Manejo seguro de sesiones
- **sanitizeText / sanitizeHtml** -- Funciones de sanitizacion en `lib/sanitize.ts`

### Archivos
- **UUID filenames** -- Nombres UUID para evitar colisiones y path traversal
- **Limite de tamano** -- 100MB por archivo (10MB para avatar/banner)
- **Limite de cantidad** -- 20 archivos simultaneos
- **MIME type filtering** -- Solo imagenes para avatar/banner

---

## Deploy en Railway

### Servicios en Railway

El proyecto usa 3 servicios:

1. **PostgreSQL** -- Base de datos
2. **Backend** (Root Directory: `backend`) -- NestJS API con Dockerfile
3. **Frontend** (Root Directory: `frontend`) -- Next.js con Dockerfile

### Configuracion del Backend

**Settings:**
- Root Directory: `backend`
- Builder: Dockerfile
- Custom Start Command: (vacio, el Dockerfile maneja todo)

**Variables:**
```
DATABASE_URL=postgresql://...@postgres.railway.internal:5432/railway
JWT_SECRET=<clave-secreta-segura>
JWT_EXPIRATION=7d
PORT=4000
FRONTEND_URL=https://adaptable-unity-production.up.railway.app
UPLOAD_DIR=/data/uploads
MAX_FILE_SIZE=104857600
```

### Configuracion del Frontend

**Settings:**
- Root Directory: `frontend`
- Builder: Dockerfile

**Variables:**
```
NEXTAUTH_URL=https://adaptable-unity-production.up.railway.app
NEXTAUTH_SECRET=<otra-clave-secreta>
NEXT_PUBLIC_API_URL=https://techlearningfiles-production.up.railway.app/api
```

### Networking

Cada servicio necesita un dominio publico:
- Backend > Settings > Networking > Generate Domain
- Frontend > Settings > Networking > Generate Domain

---

## Persistencia de Archivos

Railway usa un filesystem efimero: los archivos se pierden en cada redeploy. Para que los archivos subidos persistan, se necesita un **Railway Volume**.

### Configurar Railway Volume

1. Railway Dashboard > Servicio Backend > Settings > Volumes
2. Click **Add Volume**
3. Mount Path: `/data/uploads`
4. Tamano: 1 GB (o mas segun necesidad)
5. Agregar variable de entorno: `UPLOAD_DIR=/data/uploads`

El backend lee `UPLOAD_DIR` para:
- Guardar archivos subidos (Multer destination)
- Servir archivos estaticos (`/uploads/` prefix)
- Eliminar archivos fisicos

Si `UPLOAD_DIR` no esta definido, usa `./uploads` como fallback (suficiente para desarrollo local).

### Notas sobre Docker en Railway

- El backend usa `node:20-slim` (no Alpine) para compatibilidad con Prisma/OpenSSL
- El frontend usa `next start -H 0.0.0.0` para aceptar trafico externo
- El backend escucha en `0.0.0.0`
- Prisma migrate se ejecuta automaticamente al iniciar el contenedor
- El CMD del Dockerfile crea el directorio `UPLOAD_DIR` si no existe

---

## Formatos de Archivos Soportados

| Tipo | Extensiones |
|---|---|
| PDF | .pdf |
| Documentos | .doc, .docx, .txt, .rtf |
| Imagenes | .jpg, .png, .gif, .svg, .webp |
| Videos | .mp4, .mov, .avi, .mkv |
| Audio | .mp3, .wav, .ogg |
| Codigo | .js, .ts, .py, .java, .html, .css, .json, .xml |
| Hojas de calculo | .xlsx, .csv |
| Archivos comprimidos | .zip, .rar, .tar.gz, .7z |
| Presentaciones | .pptx, .ppt |
| Otros | cualquier formato |

---

## Troubleshooting

### "Application failed to respond" en Railway
- Verificar que el servicio escucha en `0.0.0.0` (no `localhost`)
- Verificar que las variables de entorno estan configuradas en Railway
- Revisar logs: Railway > Deployments > click en deploy > Logs
- No usar Custom Start Command si el Dockerfile ya tiene CMD

### Archivos devuelven 404 tras redeploy
- Causa: Railway filesystem efimero borra los archivos al redesplegar
- Solucion: Configurar un Railway Volume montado en `/data/uploads` y variable `UPLOAD_DIR=/data/uploads`
- Ver seccion [Persistencia de Archivos](#persistencia-de-archivos)

### Error de CORS
- Verificar que `FRONTEND_URL` en el backend usa `https://` y apunta al dominio correcto
- El backend permite origenes configurados en `main.ts`

### Prisma "No migration found"
- Los archivos de migracion deben estar en el repo: `backend/prisma/migrations/`
- Generar migraciones localmente: `npx prisma migrate dev --name nombre`
- Hacer commit y push de la carpeta `migrations/`

### Prisma OpenSSL error en Docker
- Usar `node:20-slim` en vez de `node:20-alpine`
- Instalar OpenSSL: `RUN apt-get update -y && apt-get install -y openssl`

### npm ci falla en Docker
- Asegurar que `package-lock.json` esta en el repo
- Generar: `npm install --package-lock-only`

### Avatar o banner no se muestra
- Verificar que la URL es `${BACKEND_URL}/uploads/uuid.ext` (sin `/api` en el medio)
- Los campos `avatar` y `banner` guardan la ruta como `/uploads/uuid.ext`

---

## Licencia

Proyecto de uso personal/academico. Creado por [@WakandianShield](https://github.com/WakandianShield).
