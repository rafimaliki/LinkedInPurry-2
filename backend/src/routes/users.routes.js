const usersListHandler = require("../handlers/users/usersListHandler");

const usersRoutes = [
  // GET /api/userslist
  {
    method: "GET",
    endpoint: "/api/userslist",
    handler: usersListHandler,
    requireAuth: false,
    params: {
      query: {
        search_term: {
          type: "string",
          required: false,
          description: "Search term to filter users",
        },
        filter: {
          type: "string",
          required: false,
          description: "Filter users by type",
        },
        connected_with: {
          type: "integer",
          required: false,
          description: "Filter users connected with user_id",
        },
      },
      headers: {
        Cookie: { type: "string", required: false, description: "auth_token" },
      },
    },
    tags: ["Users"],
  },
];

module.exports = usersRoutes;
