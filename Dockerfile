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

# -------- PROD (API + static) --------
FROM base AS prod
# Reaproveita a instalação do base (inclui devDeps; necessário pois usamos tsx no start)
COPY --from=web-build /app/dist /app/dist
ENV NODE_ENV=production
ENV SERVE_WEB=1
EXPOSE 8787
CMD ["npm", "run", "start"]
