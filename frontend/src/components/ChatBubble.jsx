import React from "react";

const ChatBubble = ({ text, author }) => {
  const isUser = author === "user";
  const alignment = isUser ? "justify-end" : "justify-start";
  const bubbleStyle = isUser ? "bg-orange-300 text-black rounded-br-none" : "bg-yellow-100 text-black rounded-bl-none";

  return (
    <div className={`flex flex-row ${alignment} items-center w-full`}>
      <div className={`w-[45%] px-4 py-3 rounded-xl m-2 ${bubbleStyle} break-words`}>
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
