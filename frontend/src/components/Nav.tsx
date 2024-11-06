'use client'

import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import socket from '@/lib/socket';  // Assumindo que a configuração do socket está aqui
import { useUser } from "@/context/UserContext";

const Nav = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { setSelectedUser } = useUser();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/auth/users');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();
      setUsers(data.map((user: any) => ({ ...user, stats: 2 }))); // Inicialmente todos offline
      console.log("Usuários carregados da API:", data);

    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    // Conexão com o WebSocket
    socket.on('connect', () => {
      console.log("Conectado ao WebSocket", socket.id);
    });

    // Evento para atualizar a lista de usuários online
    socket.on('users-online', (onlineUsers: User[]) => {
      console.log("Usuários online:", onlineUsers);
      
      // Atualiza os usuários, marcando o status como online ou offline
      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2, // 1: online, 2: offline
        }))
      );
    });

    // Chamada inicial para buscar os usuários via API
    fetchUsers();

    // Cleanup ao sair do componente
    return () => {
      socket.off('connect');
      socket.off('users-online');
    };
  }, []); // Este efeito ocorre uma vez, quando o componente é montado

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