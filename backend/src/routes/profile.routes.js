const profileHandler = require("../handlers/profile/profileHandler");
const editProfileHandler = require("../handlers/profile/editProfileHandler");

const profileRoutes = [
  // 2A GET /api/profile/:user_id
  {
    method: "GET",
    endpoint: "/api/profile/:user_id",
    handler: profileHandler,
    requireAuth: false,
    params: {
      query: {
        user_id: {
          type: "string",
          required: true,
          description: "User ID to retrieve profile",
        },
      },
    },
    tags: ["Profile"],
  },

  // 2B PUT /api/profile/:user_id
  {
    method: "PUT",
    endpoint: "/api/profile/:user_id",
    handler: editProfileHandler,
    requireAuth: true,
    params: {
      query: {
        user_id: {
          type: "string",
          required: true,
          description: "User ID to edit profile",
        },
      },
      header: {
        Cookie: {
          type: "string",
          required: true,
          description: "auth_token",
        },
      },
    },
    tags: ["Profile"],
  },
];

module.exports = profileRoutes;
