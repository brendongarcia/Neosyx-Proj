// 'use client'

// import { useEffect, useState } from "react";

// import UserCard from "../components/UserCard";
// import socket from '@/lib/socket'
// import { useUser } from "@/context/UserContext";

// const Nav = () => {
//   const [users, setUsers] = useState<User[]>([])
//   const [onlineUsers, setOnlineUsers] = useState<User[]>([])
//   const {setSelectedUser} = useUser()

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('http://localhost:8888/api/auth/users');
//         if (!response.ok) {
//           throw new Error('Erro ao buscar usuários');
//         }
  
//         const data = await response.json();
//         setUsers(data.map((user: any) => ({ ...user, stats: 2 })));
  
//       } catch (error) {
//         console.error("Erro ao buscar usuários:", error);
//       }
//     };
  
//     fetchUsers();
  
//     socket.on('users-online', (onlineUsers: User[]) => {

//       setUsers(prevUsers => 
//         prevUsers.map(user => ({
//           ...user,
//           stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2
//         }))
//       );
//     });
  
//     return () => {
//       socket.off('users-online');
//     };
//   }, []);

//   return (
//     <nav className="h-screen p-2 bg-gray-600">
//       <ul className="flex flex-col list-none">        
//         {users.length <= 1 ? (<p>No users</p>) : 
//         /* @ts-expect-error: */
//         (users.filter((user) => user.name != socket?.auth?.user?.name).map((user, index) => (
//           <button key={index} onClick={() => setSelectedUser(user)}>
//             <li >
//               <UserCard user={user}/>
//             </li>
//           </button>
//         )))}
//       </ul>
//     </nav>
//   );
// };

// export default Nav;
'use client';

import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import socket from '@/lib/socket'
import { useUser } from "@/context/UserContext";

const Nav = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { setSelectedUser } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/auth/users');
        if (!response.ok) {
          throw new Error('Erro ao buscar usuários');
        }
  
        const data = await response.json();
        setUsers(data.map((user: any) => ({ ...user, stats: 2 })));
  
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
  
    fetchUsers();
  
    socket.on('users-online', (onlineUsers: User[]) => {
      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2
        }))
      );
    });
  
    return () => {
      socket.off('users-online');
    };
  }, []);

  return (
    <nav className="h-screen w-64 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="text-white font-semibold text-lg mb-4">Usuários</div>
      <ul className="flex flex-col space-y-4 overflow-y-auto">
        {users.length <= 1 ? (
          <p className="text-gray-400">No users</p>
        ) : (
          users.filter(user => user.name !== socket?.auth?.user?.name).map((user, index) => (
            <button
              key={index}
              onClick={() => setSelectedUser(user)}
              className="w-full hover:bg-gray-700 rounded-lg p-2 transition duration-300"
            >
              <li className="flex items-center space-x-3">
                {/* Indicador de status */}
                <div
                  className={`w-3 h-3 rounded-full ${user.stats === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                />
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
