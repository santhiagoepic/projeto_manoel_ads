import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import db from '../db';
import { INITIAL_DATA } from '../constants';

const API_PORT = Number(process.env.API_PORT ?? 8787);
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
const REMOTE_IMAGE_TIMEOUT_MS = Number(process.env.REMOTE_IMAGE_TIMEOUT_MS ?? 15000);
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 8 * 1024 * 1024);
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const SERVE_WEB =
  process.env.SERVE_WEB === '1'
    ? true
    : process.env.SERVE_WEB === '0'
      ? false
      : process.env.NODE_ENV === 'production' && fs.existsSync(DIST_DIR);

function nowIso() {
  return new Date().toISOString();
}

function ensureSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_tokens (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES admin_users(id)
    );

    CREATE TABLE IF NOT EXISTS landing_page_data (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function ensureSeedData() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@fpdr.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  const adminCount = db.prepare('SELECT COUNT(1) as c FROM admin_users').get() as { c: number };
  if (adminCount.c === 0) {
    const passwordHash = bcrypt.hashSync(adminPassword, 12);
    db.prepare('INSERT INTO admin_users (email, password_hash, created_at) VALUES (?, ?, ?)').run(
      adminEmail,
      passwordHash,
      nowIso(),
    );
  }

  const row = db.prepare('SELECT json FROM landing_page_data WHERE id = 1').get() as { json?: string } | undefined;
  if (!row?.json) {
    db.prepare('INSERT OR REPLACE INTO landing_page_data (id, json, updated_at) VALUES (1, ?, ?)').run(
      JSON.stringify(INITIAL_DATA),
      nowIso(),
    );
  }

  // Migração automática: se ainda existirem URLs remotas nas imagens do tema,
  // tenta baixar uma vez e embutir como data URL dentro do SQLite.
  // (Se falhar por falta de internet, mantém as URLs e tenta novamente no próximo start.)
  void migrateRemoteThemeImagesIfNeeded();
}

function isRemoteUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

function extFromContentType(contentType: string | null): string {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('png')) return '.png';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('gif')) return '.gif';
  if (ct.includes('svg')) return '.svg';
  return '.jpg';
}

async function urlToUploadedFile(url: string): Promise<string> {
  const res = await fetchWithTimeout(url, REMOTE_IMAGE_TIMEOUT_MS);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const contentType = res.headers.get('content-type');
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength > MAX_UPLOAD_BYTES) throw new Error('Imagem muito grande');

  ensureUploadDir();
  const fileName = `${randomUUID()}${extFromContentType(contentType)}`;
  const absPath = path.join(UPLOAD_DIR, fileName);
  fs.writeFileSync(absPath, buf);
  return `/uploads/${fileName}`;
}

async function migrateRemoteThemeImagesIfNeeded() {
  const row = db.prepare('SELECT json FROM landing_page_data WHERE id = 1').get() as { json?: string } | undefined;
  if (!row?.json) return;

  let data: any;
  try {
    data = JSON.parse(row.json);
  } catch {
    return;
  }

  const theme = data?.theme;
  if (!theme) return;

  const keys = ['heroBgImage', 'puzzleImage', 'lawImage', 'pillsImage', 'handshakeImage', 'lawyerImage'] as const;
  const remoteKeys = keys.filter((k) => isRemoteUrl(theme[k]));
  if (remoteKeys.length === 0) return;

  for (const k of remoteKeys) {
    try {
      theme[k] = await urlToUploadedFile(theme[k]);
    } catch {
      // Se não conseguir baixar, não quebra o servidor.
      // Vai tentar de novo no próximo start.
    }
  }

  db.prepare('UPDATE landing_page_data SET json = ?, updated_at = ? WHERE id = 1').run(
    JSON.stringify(data),
    nowIso(),
  );
}

type AuthedRequest = express.Request & { userId?: number };

function authMiddleware(req: AuthedRequest, res: express.Response, next: express.NextFunction) {
  const header = req.header('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];
  if (!token) return res.status(401).json({ error: 'missing_token' });

  const tokenRow = db
    .prepare('SELECT user_id as userId, expires_at as expiresAt FROM auth_tokens WHERE token = ?')
    .get(token) as { userId: number; expiresAt: string } | undefined;

  if (!tokenRow) return res.status(401).json({ error: 'invalid_token' });
  if (Date.parse(tokenRow.expiresAt) < Date.now()) {
    db.prepare('DELETE FROM auth_tokens WHERE token = ?').run(token);
    return res.status(401).json({ error: 'expired_token' });
  }

  req.userId = tokenRow.userId;
  next();
}

function main() {
  ensureSchema();
  ensureSeedData();

  ensureUploadDir();

  const app = express();

  const extraCorsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const corsOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', ...extraCorsOrigins];

  app.use(
    cors({
      origin: corsOrigins,
    }),
  );

  app.use(express.json({ limit: '60mb' }));

  // Servir uploads como arquivos estáticos
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Produção: servir o frontend buildado (Vite -> dist)
  if (SERVE_WEB) {
    app.use(express.static(DIST_DIR));
  }

  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    // body-parser / express.json payload too large
    if (err?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'payload_too_large' });
    }
    return next(err);
  });

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        ensureUploadDir();
        cb(null, UPLOAD_DIR);
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || extFromContentType(file.mimetype);
        cb(null, `${randomUUID()}${ext}`);
      },
    }),
    limits: { fileSize: MAX_UPLOAD_BYTES },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) return cb(new Error('invalid_file_type'));
      cb(null, true);
    },
  });

  app.post('/api/uploads', authMiddleware, upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'missing_file' });
    return res.json({ url: `/uploads/${file.filename}` });
  });

  app.post('/api/auth/login', (req, res) => {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');

    if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

    const user = db
      .prepare('SELECT id, email, password_hash as passwordHash FROM admin_users WHERE email = ?')
      .get(email) as { id: number; email: string; passwordHash: string } | undefined;

    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

    db.prepare('INSERT INTO auth_tokens (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(
      token,
      user.id,
      expiresAt,
      nowIso(),
    );

    return res.json({ token, expiresAt, email: user.email });
  });

  app.get('/api/auth/me', authMiddleware, (req: AuthedRequest, res) => {
    const user = db
      .prepare('SELECT id, email, created_at as createdAt FROM admin_users WHERE id = ?')
      .get(req.userId) as { id: number; email: string; createdAt: string } | undefined;

    if (!user) return res.status(401).json({ error: 'invalid_user' });
    return res.json({ user });
  });

  app.post('/api/auth/logout', authMiddleware, (req: AuthedRequest, res) => {
    const header = req.header('authorization') ?? '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];
    if (token) db.prepare('DELETE FROM auth_tokens WHERE token = ?').run(token);
    return res.json({ ok: true });
  });

  app.get('/api/landing-data', (_req, res) => {
    const row = db.prepare('SELECT json, updated_at as updatedAt FROM landing_page_data WHERE id = 1').get() as
      | { json: string; updatedAt: string }
      | undefined;

    if (!row) return res.status(404).json({ error: 'not_found' });

    return res.json({ data: JSON.parse(row.json), updatedAt: row.updatedAt });
  });

  app.put('/api/landing-data', authMiddleware, (req, res) => {
    const data = req.body?.data;
    if (!data) return res.status(400).json({ error: 'missing_data' });

    db.prepare('UPDATE landing_page_data SET json = ?, updated_at = ? WHERE id = 1').run(
      JSON.stringify(data),
      nowIso(),
    );

    return res.json({ ok: true });
  });

  app.post('/api/landing-data/reset', authMiddleware, async (_req, res) => {
    // Reset para um padrão que também tenta ficar 100% dentro do SQLite.
    const data: any = JSON.parse(JSON.stringify(INITIAL_DATA));
    const theme = data.theme;
    const keys = ['heroBgImage', 'puzzleImage', 'lawImage', 'pillsImage', 'handshakeImage', 'lawyerImage'] as const;
    for (const k of keys) {
      if (isRemoteUrl(theme?.[k])) {
        try {
          theme[k] = await urlToUploadedFile(theme[k]);
        } catch {
          // Se não conseguir baixar, mantém a URL.
        }
      }
    }

    db.prepare('UPDATE landing_page_data SET json = ?, updated_at = ? WHERE id = 1').run(
      JSON.stringify(data),
      nowIso(),
    );
    return res.json({ ok: true });
  });

  // Fallback do SPA (somente GET e fora de /api e /uploads)
  if (SERVE_WEB) {
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (!fs.existsSync(indexPath)) return next();
      return res.sendFile(indexPath);
    });
  }

  app.listen(API_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] listening on http://localhost:${API_PORT}`);
  });
}

main();
