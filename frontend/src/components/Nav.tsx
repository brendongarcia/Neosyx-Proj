// 'use client';

// import { useEffect, useState } from "react";
// import UserCard from "../components/UserCard";
// import socket from '@/lib/socket'; // Importa a configuração do socket
// import { useUser } from "@/context/UserContext"; // Se estiver usando Context

// const Nav = () => {
//   const [users, setUsers] = useState<User[]>([]); // Estado para armazenar os usuários
//   const { setSelectedUser } = useUser(); // Supondo que você tenha um contexto de usuário

//   // Função para buscar usuários via API
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('http://localhost:8888/api/auth/users');
//       if (!response.ok) {
//         throw new Error('Erro ao buscar usuários');
//       }
//       const data = await response.json();
//       setUsers(data.map((user: any) => ({ ...user, stats: 2 }))); // Inicialmente todos offline
//     } catch (error) {
//       console.error("Erro ao buscar usuários:", error);
//     }
//   };

//   useEffect(() => {
//     if (socket) {
//       socket.on('connect', () => {
//         console.log('Conectado ao WebSocket');
//       });
  
//       socket.on('users-online', (onlineUsers: User[]) => {
//         console.log('Usuários online recebidos:', onlineUsers); // Verifique os usuários recebidos
//         setUsers(prevUsers => 
//           prevUsers.map(user => ({
//             ...user,
//             stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2, // online/offline
//           }))
//         );
//       });
  
//       // Chamada inicial para buscar os usuários
//       fetchUsers();
  
//       return () => {
//         socket.off('connect');
//         socket.off('users-online');
//       };
//     }
//   }, [socket]);
  

//   return (
//     <nav className="h-screen p-4 bg-gray-800 shadow-lg flex flex-col items-start">
//       <h2 className="text-lg font-bold text-white mb-4">Usuários Online</h2>
//       <ul className="flex flex-col w-full space-y-2">
//         {users.length === 0 ? (
//           <p className="text-gray-400">Nenhum usuário disponível</p>
//         ) : (
//           users
//             .filter(user => user.name !== socket?.auth?.user?.name) // Filtra o próprio usuário
//             .map((user, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedUser(user)}
//                 aria-label={`Selecionar usuário ${user.name}`}
//               >
//                 <li>
//                   <UserCard user={user} />
//                 </li>
//               </button>
//             ))
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Nav;

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
    <nav className="h-screen p-4 bg-gray-900 text-white shadow-lg flex flex-col items-start rounded-lg border-2 border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-green-400">Usuários Online</h2>
      <ul className="flex flex-col w-full space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum usuário disponível</p>
        ) : (
          users
            .filter(user => user.name !== socket?.auth?.user?.name) // Filtra o próprio usuário
            .map((user, index) => (
              <button
                key={index}
                onClick={() => setSelectedUser(user)}
                aria-label={`Selecionar usuário ${user.name}`}
                className="w-full p-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-between transition-all duration-200 ease-in-out transform hover:scale-105"
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
