import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <style>
        {`
          ::-webkit-scrollbar {
            width: 16px;
            background-color:rgba(66, 23, 23, 0);
          }
          ::-webkit-scrollbar-track {
            background: rgba(81, 46, 15, 0.6);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: rgb(175, 100, 30) ;
            border-radius: 10px;
            border: 2px solid rgba(81, 46, 15, 0.6);
          }
          ::-webkit-scrollbar-button:single-button {
            background-color: rgba(81, 46, 15, 0.6);
            height: 16px;
            display: block;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 7px;
          }
          ::-webkit-scrollbar-button:single-button:vertical:decrement {
            background-image: url('data:image/svg+xml;utf8,<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><polygon points="5,2 2,7 8,7" fill="gray"/></svg>');
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          ::-webkit-scrollbar-button:single-button:vertical:increment {
            background-image: url('data:image/svg+xml;utf8,<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><polygon points="2,3 8,3 5,8" fill="gray"/></svg>');
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        `}
      </style>

      <div className="min-h-screen bg-[url('images/background.png')] bg-cover bg-center flex flex-col justify-between p-4">
        <h1 className="text-6xl text-orange-400 font-serif text-center mb-4">Talesmith</h1>

        <div className="flex flex-col overflow-y-auto gap-2 mb-4 max-h-[70vh] px-2">
          {messages.map((msg, i) => (
            <ChatBubble key={i} text={msg.text} author={msg.author} />
          ))}
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
    </>
  );
};

export default ChatPage;