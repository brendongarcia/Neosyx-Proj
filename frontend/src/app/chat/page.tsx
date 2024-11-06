'use client';

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useRef } from "react";

export default function Page() {
  const room = 'general';
  const { user } = useAuth();
  const { selectedUser } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/auth/getMessages');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      
      const data = await response.json();

      const formattedMessages = data.map((row: any) => ({
        to: { id: row.to_user_id, name: row.to_user_name },
        sender: { id: row.from_user_id, name: row.from_user_name },
        content: row.message
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      <main className="flex flex-col justify-between bg-[#0a0a0a] min-h-screen h-full w-full flex-1 p-4">
        <div className="flex flex-col w-full space-y-4 overflow-y-scroll">
          {filteredMessages.map((message, index) => {
            const showName = index === 0 || message.to?.id !== filteredMessages[index - 1].to?.id;
            return (
              <div key={index} className={`flex flex-row w-full ${message.sender?.id === user?.id ? "justify-end" : "justify-start"}`}>
                <div className={`mt-2 ${message.sender?.id === user?.id ? "bg-[#008069]" : "bg-gray-600"} rounded-lg max-w-xs p-2 shadow-lg`}>
                  {showName && (
                    <span className="font-semibold text-green-300 text-xs">{message.sender.name}</span>
                  )}
                  <p className={`mt-1 text-white text-sm`}>
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <input
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Enviar
          </button>
        </div>
      </main>
    )
  );
}
