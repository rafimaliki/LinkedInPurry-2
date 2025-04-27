import React from "react";

interface ChatBubbleProps {
  message: string;
  isSender: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} w-full mb-2`}>
      <div
        className={`max-w-[75%] p-3 rounded-lg ${
          isSender ? "bg-blue-600 text-white" : "bg-gray-100 text-neutral-800"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;