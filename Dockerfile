# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app

# better-sqlite3 pode precisar compilar (node-gyp) dependendo da plataforma/versão
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# -------- DEV --------
FROM base AS dev
EXPOSE 3000 8787
CMD ["npm", "run", "dev"]

# -------- BUILD WEB (prod) --------
FROM base AS web-build
ENV NODE_ENV=production
RUN npm run build

# -------- PROD (API only) --------
FROM base AS api-prod
ENV NODE_ENV=production
ENV SERVE_WEB=0
EXPOSE 8787
CMD ["npm", "run", "start:api"]

# -------- PROD (WEB only) --------
FROM node:22-bookworm-slim AS web-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=web-build /app/dist /app/dist
COPY web-server.mjs /app/web-server.mjs
ENV WEB_PORT=3000
EXPOSE 3000
CMD ["node", "web-server.mjs"]
