const exampleHandler = require("../handlers/example/exampleHandler");

const { chatHistory, chatList } = require("../handlers/chat/chat");

const chatRoutes = [
  // GET /api/chat/history
  {
    method: "GET",
    endpoint: "/api/chat/history",
    handler: chatHistory,
    requireAuth: true,
    params: {
      query: {
        chat_partner_id: {
          type: "integer",
          required: true,
          description: "ID of the chat partner",
        },
      },
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    tags: ["Chat"],
  },

  // GET /api/chat/list
  {
    method: "GET",
    endpoint: "/api/chat/list",
    handler: chatList,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    tags: ["Chat"],
  },
];

module.exports = chatRoutes;
