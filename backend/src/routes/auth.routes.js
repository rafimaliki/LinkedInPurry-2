const registerHandler = require("../handlers/auth/registerHandler");
const loginHandler = require("../handlers/auth/loginHandler");
const logoutHandler = require("../handlers/auth/logoutHandler");
const getUser = require("../handlers/auth/getUser");

const authRoutes = [
  // 1A POST /api/login
  {
    method: "POST",
    endpoint: "/api/login",
    handler: loginHandler,
    requireAuth: false,
    params: {
      body: {
        identifier: { type: "string", required: true },
        password: { type: "string", required: true },
      },
    },
    // responses: {
    //   200: {
    //     description: "Login successful",
    //     content: {
    //       "application/json": {
    //         example: {
    //           success: true,
    //           message: "Login successful",
    //           token: "...",
    //         },
    //       },
    //     },
    //   },
    //   401: {
    //     description: "Invalid credentials",
    //     content: {
    //       "application/json": {
    //         example: {
    //           success: false,
    //           message: "Invalid username or password",
    //         },
    //       },
    //     },
    //   },
    // },
    tags: ["Auth"],
  },

  // 1B POST /api/register
  {
    method: "POST",
    endpoint: "/api/register",
    handler: registerHandler,
    requireAuth: false,
    params: {
      body: {
        username: { type: "string", required: true },
        email: { type: "string", required: true },
        name: { type: "string", required: true },
        password: { type: "string", required: true },
      },
    },
    // responses: {
    //   201: {
    //     description: "User registered successfully",
    //     content: {
    //       "application/json": {
    //         example: { success: true, message: "User registered", userId: 123 },
    //       },
    //     },
    //   },
    //   400: {
    //     description: "Invalid input",
    //     content: {
    //       "application/json": {
    //         example: { success: false, message: "Invalid input data" },
    //       },
    //     },
    //   },
    // },
    tags: ["Auth"],
  },

  // POST /api/logout
  {
    method: "POST",
    endpoint: "/api/logout",
    handler: logoutHandler,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    // responses: {
    //   200: {
    //     description: "Logout successful",
    //     content: {
    //       "application/json": {
    //         example: { success: true, message: "Logout successful" },
    //       },
    //     },
    //   },
    // },
    tags: ["Auth"],
  },

  // GET /api/getUser
  {
    method: "GET",
    endpoint: "/api/getUser",
    handler: getUser,
    requireAuth: true,
    params: {
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    // responses: {
    //   200: {
    //     description: "User details retrieved successfully",
    //     content: {
    //       "application/json": {
    //         example: { success: true, user: { id: 123, username: "test" } },
    //       },
    //     },
    //   },
    //   404: {
    //     description: "User not found",
    //     content: {
    //       "application/json": {
    //         example: { success: false, message: "User not found" },
    //       },
    //     },
    //   },
    // },
    tags: ["Auth"],
  },
];

module.exports = authRoutes;
