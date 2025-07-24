const ChatBubble = ({ text, author, time }) => {

  const isUser = (author || "").toLowerCase() === "jogador";
  const alignment = isUser ? "justify-end" : "justify-start";
  const bubbleStyle = isUser ? "bg-orange-300 text-black rounded-br-none" : "bg-yellow-100 text-black rounded-bl-none";

  return (
    <div className={`flex flex-row ${alignment} items-center w-full`}>
      <div className={`w-[60%] px-5 py-3 rounded-xl m-2 ${bubbleStyle} break-words`}>
        {text}
        <p className='text-sm font-bold opacity-50 text-right'>{time}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
