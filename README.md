<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HzQy7o3os8XdddPx55Bds0LbjP6Lglku

## Run Locally

## Como rodar

### Desenvolvimento (site + banco local)

- `npm run dev` inicia 2 processos:
   - Web (Vite)
   - API local (Node/Express) + SQLite

### Acesso ao painel

- Como o projeto usa **HashRouter**, as rotas ficam assim:
   - Login: `http://localhost:3000/#/login`
   - Admin: `http://localhost:3000/#/admin`

### Credenciais do admin

- Por padrão (definido em `.env.local`):
   - Email: `ADMIN_EMAIL`
   - Senha: `ADMIN_PASSWORD`

Na primeira vez que você roda o servidor, ele cria/abre `database.sqlite` e faz o seed do admin e dos dados iniciais da landing.

### Onde os dados ficam salvos

- A landing é salva no SQLite (tabela `landing_page_data`) via API `PUT /api/landing-data`.
- O frontend mantém um fallback no `localStorage` (`legal_landing_data`) caso a API local esteja fora.

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Rodar com Docker

### Desenvolvimento (hot reload)

- Sobe Web (Vite) em `http://localhost:3000` e API em `http://localhost:8787`:
   - `docker compose up --build`

Persistência no Docker (volumes bind):
- SQLite: pasta `data/` (arquivo `database.sqlite`)
- Uploads: pasta `uploads/`

Variáveis (opcionais) via PowerShell, antes do compose:
- `$env:ADMIN_EMAIL="admin@fpdr.com"`
- `$env:ADMIN_PASSWORD="admin123"`
- `$env:GEMINI_API_KEY="..."`

### Produção (API servindo o build do site)

- Sobe tudo em uma porta só (API + site): `http://localhost:8787`
   - `docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build`
