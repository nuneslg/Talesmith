const ChatBubble = ({ text, author }) => {
  const isUser = author === "user";
  const alignment = isUser ? "items-end" : "items-start";
  const bubbleStyle = isUser ? "bg-orange-300 text-black rounded-br-none" : "bg-yellow-100 text-black rounded-bl-none";

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-[75%] px-4 py-3 rounded-xl m-2 ${bubbleStyle}`}>
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
