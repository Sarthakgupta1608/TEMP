# ==========================================
# Stage 1: Build Frontend Assets
# ==========================================
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# Copy dependency manifests and install exact dependencies
COPY package*.json ./
RUN npm ci

# Pass API URL build argument (defaults to relative /api/v1 for reverse proxy)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Copy source and configurations
COPY index.html vite.config.ts tsconfig*.json ./
COPY public ./public/
COPY src ./src/

# Compile production bundle
RUN npm run build

# ==========================================
# Stage 2: Nginx Web Server Runtime
# ==========================================
FROM nginx:alpine AS runner

# Copy compiled static assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback and API reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

