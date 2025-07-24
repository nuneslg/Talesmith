import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatBubble from "./_components/ChatBubble";
import { formatTime } from "../../utils/time";

const ChatPage = () => {

  const location = useLocation();
  const historiaId = location.state?.config?.id;
  const contextoInicial = location.state?.config?.contexto;
  const isNew = location.state?.isNew ?? true; 

  console.log("historiaId:", historiaId);
  console.log("contextoInicial:", contextoInicial);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userTurn, setUserTurn] = useState(true);
  const [modo, setModo] = useState("acao");
  const messagesEndRef = useRef(null);

  const jaBuscouCenaInicial = useRef(false);

  useEffect(() => {
    if (!historiaId || !contextoInicial) return;

    // História nova → busca cena inicial
    if (isNew && !jaBuscouCenaInicial.current) {
      jaBuscouCenaInicial.current = true; // marca que já fez a requisição

      console.log("🔁 Buscando cena-inicial...");

      // Chama backend para primeira mensagem da IA 
      fetch("http://localhost:5000/api/cena-inicial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historia_id: historiaId, contexto: contextoInicial }),
      })
        .then((res) => res.json())
        .then((data) => {
          const response = {
            author: "mestre",
            text: data.resposta,
            time: formatTime(),
          };
          setMessages([response]); // inicia só com essa mensagem
          setUserTurn(true);
        })
        .catch((err) => {
          console.error("Erro no backend:", err);
        });
    }

    // História existente → busca mensagens salvas no banco
    if (!isNew) {
      fetch(`http://localhost:5000/api/mensagens/${historiaId}`)
        .then((res) => res.json())
        .then((mensagensDoBanco) => {
          const msgs = mensagensDoBanco.map((m) => ({
            author: m.autor, // "user" ou "ia"
            text: m.conteudo,
            time: formatTime(m.data), 
          }));
          setMessages(msgs);
          setUserTurn(true);
        })
        .catch((err) => console.error("Erro ao buscar mensagens salvas:", err));
    }
}, [historiaId, contextoInicial, isNew]);

  const sendMessage = () => {
    if (!input.trim() || !userTurn) return;

    const newMessage = { author: "jogador", text: input, time: formatTime() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setUserTurn(false);

    if (!historiaId) {
      console.error("historiaId está indefinido, não pode enviar mensagem");
      setUserTurn(true);
      return;
    }

    const payload =
      modo === "contexto"
        ? { historia_id: historiaId, contexto: input }
        : { historia_id: historiaId, contexto: messages.map((m) => m.text).join("\n"), acao: input };

    const url =
      modo === "contexto"
        ? "http://localhost:5000/api/cena-inicial"
        : "http://localhost:5000/api/acao-jogador";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const response = {
          author: "mestre",
          text: data.resposta,
          time: formatTime(),
        };
        setMessages((prev) => [...prev, response]);
        setUserTurn(true);
        if (modo === "contexto") setModo("acao"); // muda modo
      })
      .catch((error) => {
        console.error("Erro ao chamar backend:", error);
        const response = {
          author: "mestre",
          text: "Erro na comunicação com o servidor.",
          time: formatTime(),
        };
        setMessages((prev) => [...prev, response]);
        setUserTurn(true);
      });
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
          <ChatBubble 
          key={i} 
          text={msg.text} 
          author={msg.author} 
          time={msg.time} 
          />
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