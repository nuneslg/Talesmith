import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // 👉 referência

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { author: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      const response = {
        author: "ia",
        text: `A IA ouviu: "${newMessage.text}" e em breve vai reagir!`,
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  // 👉 Faz scroll automático quando messages mudar
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[url('/bg.png')] bg-cover bg-center flex flex-col justify-between p-4">
      <h1 className="text-4xl text-orange-400 font-serif text-center mb-4">Talesmith</h1>

      <div className="flex flex-col overflow-y-auto gap-2 mb-4 max-h-[70vh] px-2">
        {messages.map((msg, i) => (
          <ChatBubble key={i} text={msg.text} author={msg.author} />
        ))}
        {/* 👇 Elemento de referência para scroll */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 bg-[#442910] p-2 rounded-full border-2 border-orange-400">
        <input
          className="flex-grow bg-transparent outline-none text-white px-3"
          placeholder="Digite sua história..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="text-orange-300 text-xl px-3">➤</button>
      </div>
    </div>
  );
};

export default ChatPage