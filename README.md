<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HzQy7o3os8XdddPx55Bds0LbjP6Lglku

## Run Locally

## Como rodar

### Desenvolvimento (frontend-only)

- `npm run dev` inicia o Vite em `http://localhost:3000`.
- Sem API: os dados editáveis/fallback ficam apenas no `localStorage` (`legal_landing_data`).

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Rodar com Docker

### Desenvolvimento (hot reload)

- Sobe somente o Web (Vite) em `http://localhost:3000`:
   - `docker compose up --build`

Variáveis (opcionais) via PowerShell, antes do compose:
- `$env:GEMINI_API_KEY="..."`

### Produção (Docker Swarm + Traefik)

- Sistema **frontend-only (sem API)**.
- Sobe 1 serviço (WEB) no Traefik:
   - FRONT: `https://${FRONT_DOMAIN}`
   - Stack: `docker stack deploy -c docker-compose.swarm.yml advmanoelneto`

Obs: configure `FRONT_DOMAIN` (veja `.env-examplo`).
