FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-slim AS runner

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Default upload directory to volume mount path for Railway
ENV UPLOAD_DIR=/data/uploads

RUN mkdir -p /data/uploads

EXPOSE 4000
CMD ["sh", "-c", "mkdir -p ${UPLOAD_DIR} && echo 'Starting app...' && (npx prisma migrate deploy 2>&1 || echo 'Migration skipped') && echo 'Starting Node server...' && node dist/main"]
