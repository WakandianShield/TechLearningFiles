# TechLearning - Academic Files Journey

> Plataforma web para organizar, subir y gestionar todos tus proyectos académicos en un solo lugar. PDFs, documentos, videos, fotos, código y cualquier tipo de archivo.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway)

---

## Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación Local](#-instalación-local)
- [Variables de Entorno](#-variables-de-entorno)
- [Base de Datos](#-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Seguridad](#-seguridad)
- [Deploy en Railway](#-deploy-en-railway)
- [Screenshots](#-screenshots)

---

## Características

- **Subida de archivos** — Sube PDFs, documentos Word, videos, fotos, código, presentaciones y más (hasta 100MB por archivo, 20 archivos simultáneos)
- **Organización por proyecto** — Agrupa archivos por proyecto académico con categoría, materia, semestre y tags
- **Búsqueda y filtrado** — Busca proyectos por nombre, materia, categoría
- **Proyectos favoritos** — Fija los proyectos más importantes
- **Dashboard** — Vista general con estadísticas de tus proyectos y archivos
- **Autenticación** — Registro e inicio de sesión con JWT + NextAuth
- **Seguridad** — Helmet (headers HTTP), DOMPurify (sanitización XSS), validación de inputs
- **Responsive** — Interfaz adaptable a móvil, tablet y desktop
- **API documentada** — Swagger UI disponible en `/api/docs`

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
| **Deploy** | Railway |
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
        :3000                    :4000
```

---

## Estructura del Proyecto

```
TechLearningFiles/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   └── schema.prisma       # Esquema de base de datos
│   ├── src/
│   │   ├── auth/               # Módulo de autenticación
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── users/              # Módulo de usuarios
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   └── dto/
│   │   │       └── update-profile.dto.ts
│   │   ├── projects/           # Módulo de proyectos
│   │   │   ├── projects.module.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── projects.controller.ts
│   │   │   └── dto/
│   │   │       ├── create-project.dto.ts
│   │   │       └── update-project.dto.ts
│   │   ├── files/              # Módulo de archivos/upload
│   │   │   ├── files.module.ts
│   │   │   ├── files.service.ts
│   │   │   └── files.controller.ts
│   │   ├── prisma/             # Prisma service
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── uploads/                # Archivos subidos (gitignored)
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/auth/[...nextauth]/route.ts  # NextAuth
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx                # Dashboard principal
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx            # Lista de proyectos
│   │   │   │   │   ├── new/page.tsx        # Crear proyecto
│   │   │   │   │   └── [id]/page.tsx       # Detalle + archivos
│   │   │   │   └── profile/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── FileList.tsx
│   │   │   └── ProjectCard.tsx
│   │   └── lib/
│   │       ├── api.ts                      # Cliente API (axios)
│   │       ├── sanitize.ts                 # DOMPurify utils
│   │       └── utils.ts                    # Helpers
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── railway.toml                # Railway deploy config
├── .gitignore
└── README.md
```

---

## Instalación Local

### Requisitos previos

- **Node.js** 18+ (recomendado 20)
- **PostgreSQL** 14+ (o usar Docker)
- **npm** o **yarn**

### 1. Clonar el repositorio

```bash
git clone https://github.com/WakandianShield/TechLearningFiles.git
cd TechLearningFiles
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores (DATABASE_URL, JWT_SECRET, etc.)

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Iniciar en desarrollo
npm run start:dev
```

El backend estará disponible en `http://localhost:4000`  
Swagger docs en `http://localhost:4000/api/docs`

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar en desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://postgres:pass@localhost:5432/techlearning` |
| `JWT_SECRET` | Clave secreta para tokens JWT | `mi-clave-super-secreta-123` |
| `JWT_EXPIRATION` | Tiempo de expiración del token | `7d` |
| `PORT` | Puerto del servidor | `4000` |
| `FRONTEND_URL` | URL del frontend (para CORS) | `http://localhost:3000` |
| `UPLOAD_DIR` | Directorio para archivos subidos | `./uploads` |
| `MAX_FILE_SIZE` | Tamaño máximo en bytes (100MB) | `104857600` |

### Frontend (`frontend/.env.local`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NEXTAUTH_URL` | URL base del frontend | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Clave secreta para NextAuth | `otra-clave-secreta-456` |
| `NEXT_PUBLIC_API_URL` | URL del API backend | `http://localhost:4000/api` |

---

## Base de Datos

### Modelos

#### User (usuarios)
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (CUID) | ID único |
| email | String | Email (único) |
| name | String | Nombre completo |
| password | String | Hash bcrypt |
| bio | String? | Biografía |
| avatar | String? | URL avatar |

#### Project (proyectos)
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (CUID) | ID único |
| title | String | Título del proyecto |
| slug | String | URL amigable (único) |
| description | String? | Descripción |
| category | Enum | PROGRAMMING, MATH, SCIENCE, etc. |
| tags | String[] | Etiquetas |
| semester | String? | Semestre académico |
| subject | String? | Materia/asignatura |
| pinned | Boolean | Fijado como favorito |
| authorId | String | FK → User |

#### ProjectFile (archivos)
| Campo | Tipo | Descripción |
|---|---|---|
| id | String (CUID) | ID único |
| originalName | String | Nombre original del archivo |
| fileName | String | Nombre UUID en disco |
| filePath | String | Ruta de acceso |
| mimeType | String | Tipo MIME |
| size | Int | Tamaño en bytes |
| fileType | Enum | PDF, IMAGE, VIDEO, DOCUMENT, etc. |
| description | String? | Descripción |
| projectId | String | FK → Project |

### Comandos Prisma útiles

```bash
npx prisma migrate dev --name <nombre>   # Crear migración
npx prisma migrate deploy                 # Aplicar migraciones (prod)
npx prisma studio                          # GUI para la BD
npx prisma generate                        # Regenerar client
```

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

> 🔒 = Requiere autenticación (Bearer Token)

---

## Seguridad

### Backend (NestJS)
- **Helmet** — Headers HTTP de seguridad (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
- **CORS** — Configurado para permitir solo el frontend autorizado
- **bcrypt** — Hashing de contraseñas con salt rounds = 12
- **JWT** — Tokens firmados con expiración configurable
- **ValidationPipe** — Validación automática de DTOs con class-validator
- **Whitelist** — Solo se aceptan campos definidos en los DTOs
- **Ownership checks** — Cada recurso verifica que el usuario sea el propietario

### Frontend (Next.js)
- **DOMPurify** — Sanitización de todo input de usuario antes de renderizar
- **Content-Security-Policy** — Headers CSP configurados en next.config.js
- **NextAuth.js** — Manejo seguro de sesiones con JWT
- **Inputs sanitizados** — Toda entrada de usuario pasa por `sanitizeText()` o `sanitizeHtml()`

### Archivos
- **UUID filenames** — Los archivos se guardan con nombres UUID para evitar colisiones y path traversal
- **Límite de tamaño** — 100MB por archivo máximo
- **Límite de cantidad** — 20 archivos simultáneos máximo

---

## Deploy en Railway

### Paso 1: Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) y crea una cuenta
2. Crea un **New Project**
3. Conecta tu repositorio de GitHub

### Paso 2: Agregar PostgreSQL

1. Click en **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway creará automáticamente la variable `DATABASE_URL`

### Paso 3: Configurar el Backend

1. Click en **"+ New"** → **"GitHub Repo"** → selecciona tu repo
2. En **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run start:prod`
3. En **Variables**, agregar:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<tu-clave-secreta>
   JWT_EXPIRATION=7d
   PORT=4000
   FRONTEND_URL=https://tu-frontend.up.railway.app
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=104857600
   ```

### Paso 4: Configurar el Frontend

1. Click en **"+ New"** → **"GitHub Repo"** → selecciona el mismo repo
2. En **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
3. En **Variables**, agregar:
   ```
   NEXTAUTH_URL=https://tu-frontend.up.railway.app
   NEXTAUTH_SECRET=<otra-clave-secreta>
   NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app/api
   ```

### Paso 5: Generar dominios

1. En cada servicio → **Settings** → **Networking** → **Generate Domain**
2. Actualizar las variables `FRONTEND_URL` y `NEXT_PUBLIC_API_URL` con los dominios generados

### Tips para Railway

- Usa **Railway Volumes** si necesitas persistencia de archivos subidos entre deploys
- Las migraciones de Prisma se ejecutan automáticamente en el start command
- Puedes ver logs en tiempo real desde el dashboard de Railway

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

## Desarrollo

```bash
# Backend (terminal 1)
cd backend && npm run start:dev

# Frontend (terminal 2) 
cd frontend && npm run dev

# Prisma Studio (terminal 3 - opcional)
cd backend && npx prisma studio
```

---

## Licencia

Este proyecto es de uso personal/académico. Creado por [@WakandianShield](https://github.com/WakandianShield).
