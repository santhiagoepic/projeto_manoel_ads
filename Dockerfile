# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# -------- DEV --------
FROM base AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# -------- BUILD WEB (prod) --------
FROM base AS web-build
ENV NODE_ENV=production
RUN npm run build

# -------- PROD (WEB only) --------
FROM node:22-bookworm-slim AS web-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=web-build /app/dist /app/dist
COPY web-server.mjs /app/web-server.mjs
ENV WEB_PORT=3000
EXPOSE 3000
CMD ["node", "web-server.mjs"]
