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
      <main
        className="flex flex-col justify-between bg-cover bg-center bg-fixed min-h-screen h-full w-full flex-1 p-4"
        style={{ backgroundImage: 'url("/caminho-da-imagem.jpg")' }}
      >
        <div className="flex flex-col w-full space-y-4 overflow-y-scroll max-h-[85vh]">
          {filteredMessages.map((message, index) => {
            const showName =
              index === 0 ||
              message.to?.id !== filteredMessages[index - 1].to?.id;
            return (
              <div
                key={index}
                className={`flex flex-row w-full ${
                  message.sender?.id === user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`mt-2 ${
                    message.sender?.id === user?.id
                      ? "bg-teal-500"
                      : "bg-blue-500"
                  } rounded-lg max-w-xs p-3 shadow-xl`}
                >
                  {showName && (
                    <span className="font-bold text-gray-900 text-lg tracking-wide">
                      {message.sender.name}
                    </span>
                  )}
                  <p className="mt-1 text-gray-100 text-base leading-relaxed tracking-wide">
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
            className="w-full p-3 bg-gray-600 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
          >
            Enviar
          </button>
        </div>
      </main>
    )
  );
  
}
