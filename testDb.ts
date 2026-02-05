// Exemplo de uso do banco de dados local SQLite
import { createUser, getUserByEmail, getAllUsers, deleteUser } from './userService';

// Criar um novo usuário
function testDb() {
  const userId = createUser({ name: 'Manoel', email: 'manoel@email.com', password: '123456' });
  console.log('Usuário criado com ID:', userId);

  // Buscar usuário por email
  const user = getUserByEmail('manoel@email.com');
  console.log('Usuário encontrado:', user);

  // Listar todos usuários
  const users = getAllUsers();
  console.log('Todos usuários:', users);

  // Deletar usuário
  deleteUser(userId);
  console.log('Usuário deletado.');
}

testDb();
