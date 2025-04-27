const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const { getChatHistory, getChatList } = require("../../repository/chat.repo");

const chatHistory = async (req, res, next) => {
  const active_user = req.active_user;
  const chat_partner_id = req.query.chat_partner_id;

  if (!chat_partner_id) {
    return next(new HTTPError(400, "Missing chat_partner_id"));
  }

  try {
    const chatHistory = await getChatHistory(active_user.id, chat_partner_id);
    res.status(200).json({ chatHistory });
  } catch (error) {
    return next(error);
  }
};

const chatList = async (req, res, next) => {
  const active_user = req.active_user;

  try {
    const chatHistory = await getChatList(active_user.id);
    res.status(200).json({ chatHistory });
  } catch (error) {
    return next(error);
  }
};

module.exports = { chatHistory, chatList };
