'use client';

import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import socket from '@/lib/socket'; // Importa a configuração do socket
import { useUser } from "@/context/UserContext"; // Se estiver usando Context

const Nav = () => {
  const [users, setUsers] = useState<User[]>([]); // Estado para armazenar os usuários
  const { setSelectedUser } = useUser(); // Supondo que você tenha um contexto de usuário

  // Função para buscar usuários via API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/auth/users');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      const data = await response.json();
      setUsers(data.map((user: any) => ({ ...user, stats: 2 }))); // Inicialmente todos offline
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Conectado ao WebSocket');
      });
  
      socket.on('users-online', (onlineUsers: User[]) => {
        console.log('Usuários online recebidos:', onlineUsers); // Verifique os usuários recebidos
        setUsers(prevUsers => 
          prevUsers.map(user => ({
            ...user,
            stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2, // online/offline
          }))
        );
      });
      
      fetchUsers();
  
      return () => {
        socket.off('connect');
        socket.off('users-online');
      };
    }
  }, [socket]);

  return (
    <nav className="h-screen p-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-xl flex flex-col items-start rounded-xl border-4 border-gradient-to-r from-gray-700 to-gray-900">
      <h2 className="text-3xl font-extrabold mb-8 text-white transform transition-all duration-300 ease-in-out hover:text-gray-300 shadow-lg p-3 rounded-lg">
        Contatos
      </h2>
      <ul className="flex flex-col w-full space-y-6">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">Nenhum usuário disponível</p>
        ) : (
          users
            .filter(user => user.name !== socket?.auth?.user?.name) // Filtra o próprio usuário
            .map((user, index) => (
              <button
                key={index}
                onClick={() => setSelectedUser(user)}
                aria-label={`Selecionar usuário ${user.name}`}
                className="w-full p-4 bg-gradient-to-r from-gray-600 to-gray-800 hover:bg-gray-500 text-white rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-lg"
              >
                <UserCard user={user} />
              </button>
            ))
        )}
      </ul>
    </nav>
  );
};

export default Nav;
