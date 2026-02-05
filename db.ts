// db.ts
// Configuração do banco de dados SQLite local usando better-sqlite3
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Caminho do arquivo do banco de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.resolve(__dirname, 'database.sqlite');

// Cria ou abre o banco de dados
const db = new Database(dbPath);

// Exemplo de criação de tabela (ajuste conforme necessidade)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

export default db;
