// "use client";
// import { useAuth } from "@/context/AuthContext";
// import { useState } from "react";

// const Page = () => {
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirmation, setPasswordConfirmation] = useState("");
//   const { register, error } = useAuth();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await register(name, username, password, passwordConfirmation);
//   };

//   return (
//     <main className="w-full">
//       <div className="flex flex-col max-w-md p-4 mx-auto text-center text-black bg-white">
//         <h1 className="mb-4 text-lg font-bold">Página de Registro</h1>
//         <form className="flex flex-col items-center gap-4" onSubmit={handleRegister}>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
//             type="text"
//             placeholder="Digite seu nome"
//             required
//           />
//           <input
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
//             type="email"
//             placeholder="Digite seu email"
//             required
//           />
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
//             type="password"
//             placeholder="Digite sua senha"
//             required
//           />
//           <input
//             value={passwordConfirmation}
//             onChange={(e) => setPasswordConfirmation(e.target.value)}
//             className="w-full p-2 text-black bg-white border border-gray-300 outline-none"
//             type="password"
//             placeholder="Confirme sua senha"
//             required
//           />
//           <button
//             className="px-4 py-2 font-bold text-white bg-blue-600 max-w-32"
//             type="submit"
//           >
//             Registrar
//           </button>
//           <p>Ja tem uma conta?</p>
//           <a className="text-blue-600" href="/login">Clique aqui</a>
          

//           {error && <p className="text-red-600">{error.message}</p>}
//         </form>
//       </div>
//     </main>
//   );
// };

// export default Page;

"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { register, error } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, username, password, passwordConfirmation);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex flex-col max-w-lg p-12 mx-auto text-center text-white bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-semibold">Página de Registro</h1>
        <form className="flex flex-col items-center gap-6" onSubmit={handleRegister}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="text"
            placeholder="Digite seu nome"
            required
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="email"
            placeholder="Digite seu email"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="password"
            placeholder="Digite sua senha"
            required
          />
          <input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="password"
            placeholder="Confirme sua senha"
            required
          />
          <button
            className="w-full px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Registrar
          </button>
          <p className="mt-4 text-sm">Já tem uma conta?</p>
          <a className="text-blue-400 hover:underline" href="/login">
            Clique aqui
          </a>

          {error && <p className="mt-2 text-red-400">{error?.message}</p>}
        </form>
      </div>
    </main>
  );
};

export default Page;
