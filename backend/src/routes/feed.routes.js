const feedList = require("../handlers/feed/feedlist");
const createFeed = require("../handlers/feed/create");
const updateFeed = require("../handlers/feed/update");
const deleteFeed = require("../handlers/feed/delete");

const feedRoutes = [
  // 4A GET /api/feed
  {
    method: "GET",
    endpoint: "/api/feed",
    handler: feedList,
    requireAuth: true,
    params: {
      query: {
        limit: {
          type: "integer",
          required: false,
          description: "Maximum number of feeds to return",
        },
      },
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    // responses: {
    //   200: {
    //     description: "Feed list retrieved successfully",
    //     content: {
    //       "application/json": {
    //         example: {
    //           success: true,
    //           feeds: [
    //             {
    //               id: 1,
    //               title: "First Feed",
    //               content: "Feed content",
    //               author: "User1",
    //             },
    //             {
    //               id: 2,
    //               title: "Second Feed",
    //               content: "More feed content",
    //               author: "User2",
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    //   401: {
    //     description: "Unauthorized access",
    //     content: {
    //       "application/json": {
    //         example: { success: false, message: "Authentication required" },
    //       },
    //     },
    //   },
    // },
    tags: ["Feed"],
  },

  // 4B POST /api/feed
  {
    method: "POST",
    endpoint: "/api/feed",
    handler: createFeed,
    requireAuth: true,
    params: {
      body: {
        content: { type: "string", required: true },
      },
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    // responses: {
    //   201: {
    //     description: "Feed created successfully",
    //     content: {
    //       "application/json": {
    //         example: {
    //           success: true,
    //           feed: {
    //             id: 123,
    //             title: "New Feed",
    //             content: "Content here",
    //             author: "User1",
    //           },
    //         },
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
    tags: ["Feed"],
  },

  // 4C PUT /api/feed/:post_id
  {
    method: "PUT",
    endpoint: "/api/feed/:post_id",
    handler: updateFeed,
    requireAuth: true,
    params: {
      path: {
        post_id: {
          type: "integer",
          required: true,
          description: "ID of the post to update",
        },
      },
      body: {
        content: { type: "string", required: false },
      },
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    // responses: {
    //   200: {
    //     description: "Feed updated successfully",
    //     content: {
    //       "application/json": {
    //         example: { success: true, message: "Feed updated successfully" },
    //       },
    //     },
    //   },
    //   404: {
    //     description: "Feed not found",
    //     content: {
    //       "application/json": {
    //         example: { success: false, message: "Feed not found" },
    //       },
    //     },
    //   },
    // },
    tags: ["Feed"],
  },

  // 4D DELETE /api/feed/:post_id
  {
    method: "DELETE",
    endpoint: "/api/feed/:post_id",
    handler: deleteFeed,
    requireAuth: true,
    params: {
      path: {
        post_id: {
          type: "integer",
          required: true,
          description: "ID of the post to delete",
        },
      },
      headers: {
        Cookie: { type: "string", required: true, description: "auth_token" },
      },
    },
    // responses: {
    //   200: {
    //     description: "Feed deleted successfully",
    //     content: {
    //       "application/json": {
    //         example: { success: true, message: "Feed deleted successfully" },
    //       },
    //     },
    //   },
    //   404: {
    //     description: "Feed not found",
    //     content: {
    //       "application/json": {
    //         example: { success: false, message: "Feed not found" },
    //       },
    //     },
    //   },
    // },
    tags: ["Feed"],
  },
];

module.exports = feedRoutes;
