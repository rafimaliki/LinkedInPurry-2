const { PrismaClient } = require("@prisma/client");
const HTTPError = require("../class/HTTPError");

const { getConnectionIds } = require("./connection.repo");
const { getUsernameAndProfilePict } = require("./user.repo");

const prisma = new PrismaClient();

const getChatHistory = async (user1_id, user2_id) => {
  // user 1: you
  // user 2: lawan bicara

  const chatFromYou = await prisma.chat.findMany({
    where: {
      AND: [
        {
          from_id: user1_id,
          to_id: user2_id,
        },
      ],
    },
  });

  const chatToYou = await prisma.chat.findMany({
    where: {
      AND: [
        {
          from_id: user2_id,
          to_id: user1_id,
        },
      ],
    },
  });

  let chatHistory = chatFromYou
    .concat(chatToYou)
    .sort((a, b) => a.timestamp - b.timestamp);
  chatHistory = chatHistory.map((chat) => {
    return {
      id: chat.id.toString(),
      from_id: chat.from_id.toString(),
      to_id: chat.to_id.toString(),
      message: chat.message,
      timestamp: chat.timestamp,
    };
  });

  return chatHistory;
};

const getLastChat = async (user1_id, user2_id) => {
  const chatHistory = await getChatHistory(user1_id, user2_id);

  if (chatHistory.length === 0) {
    return null;
  }
  return chatHistory[chatHistory.length - 1];
};

const getChatList = async (user_id) => {
  const connectionIds = await getConnectionIds(user_id);

  const friends = [];
  for (const connectionId of connectionIds) {
    const friend = await getUsernameAndProfilePict(connectionId);
    friends.push(friend);
  }

  const chatList = await Promise.all(
    friends.map(async (friend) => {
      const last_chat = await getLastChat(user_id, friend.id);
      return {
        ...friend,
        last_chat: last_chat,
      };
    })
  );

  chatList.sort((a, b) => {
    if (a.last_chat && b.last_chat) {
      return b.last_chat.timestamp - a.last_chat.timestamp;
    }
    if (a.last_chat && !b.last_chat) {
      return -1;
    }
    if (!a.last_chat && b.last_chat) {
      return 1;
    }
    return 0;
  });

  return chatList;
};

const addChat = async (from_id, to_id, message) => {
  const chat = await prisma.chat.create({
    data: {
      from_id: from_id,
      to_id: to_id,
      message: message,
      timestamp: new Date(),
    },
  });

  return chat;
};

module.exports = {
  getChatHistory,
  getChatList,
  addChat,
};
