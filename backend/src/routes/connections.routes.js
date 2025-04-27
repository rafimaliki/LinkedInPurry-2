const connectionsReqlistHandler = require("../handlers/connections/reqlist");
const createRequest = require("../handlers/connections/create");
const declineRequest = require("../handlers/connections/decline");
const acceptRequest = require("../handlers/connections/accept");
const deleteConnection = require("../handlers/connections/delete");

const connectionsRoutes = [
  // GET /api/connections/reqlist
  {
    method: "GET",
    endpoint: "/api/connections/reqlist",
    handler: connectionsReqlistHandler,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
      query: {
        search_term: {
          type: "string",
          required: false,
          description: "Search term to filter requests",
        },
      },
    },
    tags: ["Connections"],
  },

  // POST /api/connections/create
  {
    method: "POST",
    endpoint: "/api/connections/create",
    handler: createRequest,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
      body: {
        to_id: { type: "integer", required: true },
      },
    },
    tags: ["Connections"],
  },

  // POST /api/connections/accept
  {
    method: "POST",
    endpoint: "/api/connections/accept",
    handler: acceptRequest,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
      body: {
        from_id: { type: "integer", required: true },
      },
    },
    tags: ["Connections"],
  },

  // POST /api/connections/decline
  {
    method: "POST",
    endpoint: "/api/connections/decline",
    handler: declineRequest,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
      body: {
        from_id: { type: "integer", required: true },
      },
    },
    tags: ["Connections"],
  },

  // POST /api/connections/delete
  {
    method: "POST",
    endpoint: "/api/connections/delete",
    handler: deleteConnection,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
      body: {
        to_id: { type: "integer", required: true },
      },
    },
    tags: ["Connections"],
  },
];

module.exports = connectionsRoutes;
