import React, { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import useActiveUser from "../../hooks/useActiveUser";
import { useLocation } from "react-router-dom";

const Chat: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [activeUser] = useActiveUser();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const chatId = parseInt(searchParams.get("chatId") || "0");
    if (chatId) {
      setActiveChatId(chatId);
    }
  }, []);

  if (!activeUser) {
    window.location.href = "/notfound";
  } else {
    return (
      <div className="h-[90vh] w-full flex justify-center ">
        <div className="flex h-full w-full overflow-hidden border">
          <div className="w-[30%] h-full">
            <ChatList
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              setUsername={setUsername}
            />
          </div>
          <div className="w-[70%] h-full">
            <ChatRoom activeChatId={activeChatId} username={username} />
          </div>
        </div>
      </div>
    );
  }
};

export default Chat;
