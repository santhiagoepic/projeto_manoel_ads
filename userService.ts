// userService.ts
// Serviço para manipulação de usuários no banco SQLite
import db from './db';

type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
};

export function createUser(user: User): number {
  const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const info = stmt.run(user.name, user.email, user.password);
  return info.lastInsertRowid as number;
}


export function getUserByEmail(email: string): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const result = stmt.get(email);
  if (!result) return undefined;
  return result as User;
}


export function getAllUsers(): User[] {
  const stmt = db.prepare('SELECT * FROM users');
  const results = stmt.all();
  return results.map(r => r as User);
}

export function deleteUser(id: number): void {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
}
