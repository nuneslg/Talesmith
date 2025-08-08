import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import ChatBubble from "./_components/ChatBubble";
import { formatTime } from "../../utils/time";

const ChatPage = () => {
  const location = useLocation();
  const historiaId = location.state?.config?.id;
  const contextoInicial = location.state?.config?.contexto;
  const isNew = location.state?.isNew ?? true;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userTurn, setUserTurn] = useState(true);
  const [modo, setModo] = useState("acao");
  const messagesEndRef = useRef(null);

  const jaBuscouCenaInicial = useRef(false);

  useEffect(() => {
    if (!historiaId || !contextoInicial) return;

    if (isNew && !jaBuscouCenaInicial.current) {
      jaBuscouCenaInicial.current = true;

      fetch("https://talesmith.onrender.com/api/cena-inicial", {
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
          setMessages([response]);
          setUserTurn(true);
        })
        .catch((err) => {
          console.error("Erro no backend:", err);
        });
    }

    if (!isNew) {
      fetch(`https://talesmith.onrender.com/api/mensagens/${historiaId}`)
        .then((res) => res.json())
        .then((mensagensDoBanco) => {
          const msgs = mensagensDoBanco.map((m) => ({
            author: m.autor,
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
    setMessages((prev) => [...prev, newMessage]);
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
        ? "https://talesmith.onrender.com/api/cena-inicial"
        : "https://talesmith.onrender.com/api/acao-jogador";

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
        if (modo === "contexto") setModo("acao");
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

  // Função para iniciar o tutorial Shepherd.js
  const startTour = () => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: "shepherd-theme-arrows",
        scrollTo: { behavior: "smooth", block: "center" },
      },
    });

    tour.addStep({
      id: "titulo",
      text: "Esse é o título do seu chat, aqui está o nome do app: Talesmith.",
      attachTo: { element: ".titulo-talesmith", on: "bottom" },
      buttons: [{ text: "Próximo", action: tour.next }],
    });

    tour.addStep({
      id: "area-mensagens",
      text: "Aqui ficam todas as mensagens do chat entre o jogador e o mestre.",
      attachTo: { element: ".chat-messages", on: "top" },
      buttons: [
        { text: "Voltar", action: tour.back },
        { text: "Próximo", action: tour.next },
      ],
    });

    tour.addStep({
      id: "input",
      text: "Neste campo você digita suas ações ou histórias para enviar ao mestre.",
      attachTo: { element: ".chat-input", on: "top" },
      buttons: [
        { text: "Voltar", action: tour.back },
        { text: "Finalizar", action: tour.complete },
      ],
    });

    tour.start();
  };

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-[url('/images/background.png')] bg-cover bg-center">
      <button
      onClick={startTour}
      aria-label="Abrir tutorial do chat"
      className="mb-6 px-4 py-2 bg-[#3B2918] hover:bg-[#2E1E13] active:bg-[#1A120C] focus:outline-none text-white rounded font-semibold transition-colors duration-300 cursor-pointer"
    >
      Como usar o chat
    </button>

      <div className="flex flex-row mb-4 justify-center">
        <div className="titulo-talesmith text-5xl max-w-[100%] text-orange-400 font-serif">
          Talesmith
        </div>
      </div>

      <div className="chat-messages flex flex-col h-[80%] mb-4 overflow-y-auto justify-items-end">
        {messages.map((msg, i) => (
          <ChatBubble key={i} text={msg.text} author={msg.author} time={msg.time} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input flex items-center gap-2 bg-[#442910] p-2 rounded-full border-2 border-orange-400">
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
