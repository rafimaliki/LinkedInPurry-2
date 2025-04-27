import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import chatroomdata from "../data/chatroomdata";
import ChatBubble from "./ChatBubble";
import useActiveUser from "../../../hooks/useActiveUser";
import { useLocation } from "react-router-dom";

import { io, Socket } from "socket.io-client";

interface ChatRoomProps {
  activeChatId: number | null;
  username: string;
}

interface MessageFromSocket {
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: Date;
}

interface ActiveUser {
  id: number;
  username: string;
  email: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ activeChatId, username }) => {
  const [messages, setMessages] = useState(chatroomdata);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [activeUser, setActiveUser] = useActiveUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chatId = parseInt(searchParams.get("chatId") || "0");
  console.log("chatId:", chatId);

  if (activeUser === null) {
    window.location.href = "/feed";
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (activeChatId === null) return;

    const newMessage = {
      sender: "YOU",
      content: inputValue,
      time_stamp: new Date().toISOString(),
    };

    const newMessageToSocket: MessageFromSocket = {
      recipientId: activeChatId,
      content: inputValue,
      timestamp: new Date(),
      senderId: Number(activeUser?.id) || 0,
    };

    if (socket) {
      socket.emit("sendMessage", newMessageToSocket);
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // tiap ganti chat, fetch chat history
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/chat/history?chat_partner_id=${activeChatId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
          console.error("Status code:", response.status);
          return;
        }

        const responseData = await response.json();
        console.log("Chat history response:", responseData);
        setMessages(
          responseData.chatHistory.map((msg: any) => ({
            sender:
              msg.from_id == (chatId ? chatId : activeChatId) ? "THEM" : "YOU",
            content: msg.message,
            timestamp: msg.timestamp,
          }))
        );
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    if (activeChatId !== null) fetchdata();
  }, [activeChatId]);

  useEffect(() => {
    if (activeChatId === null || activeUser === null) return;
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    const currentUser = { name: activeUser.username, id: activeUser.id };
    const recipientUser = { name: username, id: Number(activeChatId) };

    socketInstance.emit("login", currentUser);

    socketInstance.on(
      "receiveMessage",
      (incomingMessage: MessageFromSocket) => {
        const isForCurrentChat =
          (incomingMessage.senderId == recipientUser.id &&
            incomingMessage.recipientId == Number(currentUser.id)) ||
          (incomingMessage.senderId == Number(currentUser.id) &&
            incomingMessage.recipientId == recipientUser.id);

        if (isForCurrentChat) {
          setMessages((prev) => {
            if (
              !prev.some(
                (msg) =>
                  msg.time_stamp ===
                  new Date(incomingMessage.timestamp).toISOString()
              )
            ) {
              return [
                ...prev,
                {
                  sender:
                    incomingMessage.senderId === recipientUser.id
                      ? "THEM"
                      : "YOU",
                  content: incomingMessage.content,
                  time_stamp: new Date(incomingMessage.timestamp).toISOString(),
                },
              ];
            }
            return prev;
          });
        }
      }
    );

    return () => {
      socketInstance.disconnect();
    };
  }, [activeUser, activeChatId]);

  if (activeChatId === null) {
    return (
      <div className="w-full h-full bg-[#f4f2ee] flex items-center justify-center">
        <p className="text-neutral-500">Select a chat to start messaging</p>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-white flex flex-col ">
        <div className="w-full border-b">
          <p className="p-3 font-semibold text-neutral-600">{username}</p>
        </div>
        <div
          className="flex flex-col p-5 h-[75vh] overflow-y-scroll flex-grow scrollbar-custom "
          ref={chatContainerRef}
        >
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              message={msg.content}
              isSender={msg.sender === "YOU"}
            />
          ))}
        </div>
        <div className="w-full border-t p-3 flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            className="flex-grow p-2 border rounded-lg mr-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    );
  }
};

export default ChatRoom;
