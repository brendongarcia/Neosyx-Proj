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
  
      // Chamada inicial para buscar os usuários
      fetchUsers();
  
      return () => {
        socket.off('connect');
        socket.off('users-online');
      };
    }
  }, [socket]);
  

  return (
    <nav className="h-screen p-4 bg-gray-800 shadow-lg flex flex-col items-start">
      <h2 className="text-lg font-bold text-white mb-4">Usuários Online</h2>
      <ul className="flex flex-col w-full space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-400">Nenhum usuário disponível</p>
        ) : (
          users
            .filter(user => user.name !== socket?.auth?.user?.name) // Filtra o próprio usuário
            .map((user, index) => (
              <button
                key={index}
                onClick={() => setSelectedUser(user)}
                aria-label={`Selecionar usuário ${user.name}`}
              >
                <li>
                  <UserCard user={user} />
                </li>
              </button>
            ))
        )}
      </ul>
    </nav>
  );
};

export default Nav;
