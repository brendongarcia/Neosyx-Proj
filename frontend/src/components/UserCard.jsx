
"use client";
 
import { useUser } from "@/context/UserContext";
 
 
const UserCard = ({ user }) => {  
  const {selectedUser} = useUser()

console.log("USER CARD: ", user)
  return (
    <div
    className={`flex flex-row justify-between w-full p-4 my-2 rounded-lg cursor-pointer 
      ${selectedUser?.name === user?.name ? 'bg-slate-400 ring-2 ring-offset-2 ring-blue-500' : 'bg-white'}
    `}
  >
    <p className="text-black">{user?.name}</p>
  
    {user?.stats === 1 && (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-green-500">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )}
  
    {user?.stats === 2 && (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-red-500">
        <circle cx="12" cy="12" r="10" />
      </svg>
    )}
  </div>
  
  );
};
 
export default UserCard;