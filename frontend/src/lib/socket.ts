import { io } from 'socket.io-client';

// Recuperar o usuário autenticado, exemplo de como pegar de um contexto ou cookies
const getUser = () => {
  // Aqui você pode pegar os dados do usuário de onde ele estiver armazenado
  // Exemplo: se você tiver um contexto de usuário ou cookies:
  return { id: "user-id-aqui", name: "Nome do usuário" }; // Substitua com dados reais
};

const user = getUser(); // Pegue o usuário autenticado dinamicamente

const socket = io('http://localhost:8888', {
  auth: { user }  // Enviar o usuário com id e name
});

socket.on('connect', () => {
  console.log('Conectado ao servidor com id:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});

export default socket;
