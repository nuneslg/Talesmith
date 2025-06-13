import { useState, useRef, useEffect } from "react";
import ChatBubble from "./_components/ChatBubble";
import { formatTime } from "../../utils/time";

const ChatPage = () => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userTurn, setUserTurn] = useState(true)
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim() || !userTurn) return;

    const newMessage = { author: "user", text: input, time: formatTime()};
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setUserTurn(false)

    setTimeout(() => {
      const response = {
        author: "ia",
        text: `A IA ouviu: "${newMessage.text}" e em breve vai reagir!`,
        time: formatTime()
      };

      console.log(response.time)
      setMessages((prev) => [...prev, response]);
      setUserTurn(true)
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-[url('images/background.png')] bg-cover bg-center">
      <div className="flex flex-row mb-4 justify-center">
        < div className="text-5xl max-w-[100%] text-orange-400 font-serif">
          Talesmith
        </div>
      </div>

      <div className="flex flex-col h-[80%] mb-4 overflow-y-auto justify-items-end">
        {messages.map((msg, i) => (
          <ChatBubble key={i} text={msg.text} author={msg.author} time={msg.time} />
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
      </div>

    </div>
  );
};

export default ChatPage;