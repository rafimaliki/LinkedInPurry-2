import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import persistentUseState from "../../hooks/presistentUseState";

interface Message {
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [active_user, setActiveUser] = useState();

  const currentUser = {
    id: parseInt(searchParams.get("id1") || "0"),
    username: searchParams.get("name1") || "User1",
  };

  const recipientUser = {
    id: parseInt(searchParams.get("id2") || "0"),
    username: searchParams.get("name2") || "User2",
  };

  const [chat, setChat] = persistentUseState<Message[]>(
    `chat-${currentUser.id}-${recipientUser.id}`,
    []
  );
  const [inputValue, setInputValue] = useState("");

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
    });
    setSocket(socketInstance);

    socketInstance.emit("login", currentUser);

    socketInstance.on("receiveMessage", (incomingMessage: Message) => {
      const isForCurrentChat =
        (incomingMessage.senderId === recipientUser.id &&
          incomingMessage.recipientId === currentUser.id) ||
        (incomingMessage.senderId === currentUser.id &&
          incomingMessage.recipientId === recipientUser.id);

      if (isForCurrentChat) {
        setChat((prev) => {
          if (
            !prev.some((msg) => msg.timestamp === incomingMessage.timestamp)
          ) {
            return [...prev, incomingMessage];
          }
          return prev;
        });
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", recipientUser.id);
    }
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      senderId: currentUser.id,
      recipientId: recipientUser.id,
      content: inputValue,
      timestamp: new Date(),
    };

    if (socket) {
      socket.emit("sendMessage", newMessage);
    }

    setChat((prev) => [...prev, newMessage]);

    setInputValue("");
  };

  return (
    <div>
      <div className="w-fit bg-white m-2">
        my data (id:{currentUser.id} username:{currentUser.username})
      </div>
      <div className="w-fit bg-white m-2">
        recipient data (id:{recipientUser.id} username:{recipientUser.username})
      </div>
      <div
        style={{ marginBottom: "10px", maxHeight: "300px", overflowY: "auto" }}
      >
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.senderId === currentUser.id ? "You" : recipientUser.username}
              :
            </strong>{" "}
            {msg.content}
            <small style={{ marginLeft: "10px", color: "#aaa" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message"
          style={{
            width: "calc(100% - 80px)",
            padding: "10px",
            marginRight: "10px",
          }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
