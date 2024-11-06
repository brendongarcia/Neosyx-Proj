'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const room = 'general';
  const { user } = useAuth();
  const { selectedUser } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/auth/getMessages');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();

      // Mapeia o retorno da API para a estrutura da interface `Message`
      const formattedMessages = data.map((row: any) => ({
          to: { id: row.idUserPara, name: row.nameUserPara },
          sender: { id: row.idUserDe, name: row.nameUserDe },
          content: row.mensagem
      }));

      setMessages(formattedMessages);

    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {

    getMessages();

    if (!selectedUser || !user) return;

    socket.emit("join-room", selectedUser.id);
    socket.emit("join-room", user.id);
    console.log("Usuário conectado ao socket:", user);

    socket.on("message", (msg) => {
      console.log("Mensagem recebida:", msg);

      setMessages((prev) => [...prev, msg]);
      getMessages();
    });

    return () => {
      socket.off("message");
    };
  }, [selectedUser, user]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;
  
    let newMessage: Message = {
      to: selectedUser as User,
      sender: user as User,
      content: messageContent,
    };
  
    try {
      const response = await fetch('http://localhost:8888/api/auth/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar a mensagem');
      }
  
      socket.emit("message", { to: selectedUser, message: newMessage });
      setMessageContent("");

      setMessages((prev) => [...prev, newMessage]);
      getMessages();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const filteredMessages = messages.filter((message) => 
    (message?.to?.id === user?.id && message?.sender?.id === selectedUser?.id) || 
    (message?.to?.id === selectedUser?.id && message?.sender?.id === user?.id)
  );

  return (
    selectedUser && (
      <main className="flex flex-col justify-between bg-[#0a0a0a] min-h-96  h-full w-full flex-1">
        <div className="flex flex-col w-full p-1 text-black overflow-y-scroll">
        {filteredMessages.map((message, index) => {
            const showName = index === 0 || message.to?.id !== filteredMessages[index - 1].to?.id;

            return (
                <div key={index} className={`flex flex-row w-full ${message.sender?.id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`mt-1 ${message.sender?.id === user?.id ? "bg-[#008069]" : "bg-gray-600"} rounded-lg w-fit`}>
                        {showName && (
                            <span className="p-2 font-bold text-green-300">
                                ~ {message.sender.name}
                            </span>
                        )}
                        <p className="px-2 mt-2 font-medium text-right text-white rounded-md w-fit">
                            {message.content}
                        </p>
                    </div>
                </div>
            );
        })}
        </div>
        <input
          className="p-2 mt-1 text-black bg-gray-200 border border-gray-300 outline-none"
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
        />
      </main>
    )
  );
}
