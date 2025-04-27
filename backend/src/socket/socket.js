const { Server } = require("socket.io");

const messages = [];
const users = new Map();

const { addChat } = require("../repository/chat.repo");
const {
  sendNotificationPush,
} = require("../handlers/vapid/pushNotificationsHandler.js");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    cookie: true,
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("login", (user) => {
      console.log("User logged in:", user);
      if (!users.has(user.id)) {
        users.set(user.id, []);
      }
      users.get(user.id).push(socket.id);
      console.log(`${user.name} logged in with socket ${socket.id}`);
    });

    socket.on("sendMessage", (message) => {
      const { senderId, recipientId, content } = message;
      const recipientSockets = users.get(recipientId.toString());
      console.log(users);

      console.log("Message received:", message);

      messages.push(message);

      if (recipientSockets) {
        recipientSockets.forEach((socketId) => {
          io.to(socketId).emit("receiveMessage", message);
        });
      } else {
        const notificationPayload = {
          title: "New chat available",
          body: "",
          url: "http://localhost:5173/chat?chatId=" + senderId,
        };

        console.log("Sending notification to:", recipientId);

        sendNotificationPush({
          user_id: recipientId,
          ...notificationPayload,
        });
      }

      addChat(senderId, recipientId, content);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketIds] of users.entries()) {
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          socketIds.splice(index, 1);
          if (socketIds.length === 0) {
            users.delete(userId);
          }
          break;
        }
      }
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
