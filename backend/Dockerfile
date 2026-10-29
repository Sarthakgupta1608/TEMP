# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:24-bookworm-slim AS builder

# Install OpenSSL for Prisma engine
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency manifests and install all packages
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate typed client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source and TypeScript configurations
COPY tsconfig.json ./
COPY src ./src/

# Compile application source to dist/
RUN npm run build

# Compile seed script for standalone execution if present
RUN if [ -f "prisma/seed.ts" ]; then \
      npx tsc prisma/seed.ts --outDir dist/prisma --skipLibCheck --module CommonJS --target ES2022 --moduleResolution node --esModuleInterop; \
    fi

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM node:24-bookworm-slim AS runner

# Install OpenSSL for Prisma SQLite runtime and curl for healthcheck
RUN apt-get update && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and generated Prisma client from builder
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma/

# Copy Prisma CLI and TSX runtime tooling for entrypoint migrations/seed
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma/
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx/
COPY --from=builder /app/node_modules/.bin/tsx ./node_modules/.bin/tsx

# Copy compiled JavaScript output
COPY --from=builder /app/dist ./dist/

# Copy entrypoint script and ensure execution permissions
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Create persistent data directory for SQLite volume and set ownership to 'node' user
RUN mkdir -p /data && chown -R node:node /app /data

# Run container as non-root user
USER node

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]

