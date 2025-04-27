import React, { useState, useEffect } from "react";
import ChatListItem from "./ChatListItem";

interface ChatListProps {
  activeChatId: number | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<number | null>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

interface LastChat {
  id: number;
  from_id: number;
  to_id: number;
  message: string;
  timestamp: string;
}

interface ChatListData {
  id: number;
  username: string;
  profile_photo_path?: string;
  last_chat?: LastChat;
}

const ChatList: React.FC<ChatListProps> = ({
  activeChatId,
  setActiveChatId,
  setUsername,
}) => {
  const [chatListData, setChatListData] = useState<ChatListData[]>([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/chat/list", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
          console.error("Status code:", response.status);
          return;
        }

        const responseData = await response.json();
        setChatListData(responseData.chatHistory);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchdata();
  }, []);

  return (
    <div className="w-full h-full bg-white border-r">
      <div className="w-full border-b">
        <p className="p-3 font-semibold text-neutral-600">Chats</p>
      </div>
      <div className="flex flex-col overflow-y-scroll overflow-x-hidden h-[80vh] scrollbar-custom">
        {chatListData?.map((chatlist, i) => (
          <ChatListItem
            key={i}
            username={chatlist.username}
            user_id={chatlist.id}
            picture={chatlist.profile_photo_path || ""}
            lastMessage={chatlist.last_chat?.message || ""}
            date={chatlist.last_chat?.timestamp || ""}
            isActive={activeChatId === chatlist.id}
            setActiveChatId={setActiveChatId}
            setUsername={setUsername}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
