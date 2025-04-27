const { requireAuth, noAuth } = require("../middlewares/auth.middleware");

const healthHandler = require("../handlers/misc/healthHandler");
const notFoundHandler = require("../handlers/misc/notFoundHandler");

const authRoutes = require("./auth.routes");
const connectionsRoutes = require("./connections.routes");
const feedRoutes = require("./feed.routes");
const profileRoutes = require("./profile.routes");
const usersRoutes = require("./users.routes");
const chatRoutes = require("./chat.routes");
const vapidRoutes = require("./vapid.routes");

const healthRoute = {
  method: "GET",
  endpoint: "/health",
  handler: healthHandler,
  requireAuth: false,
  tags: ["Health"],
};

const wildCardRoute = {
  method: "USE",
  endpoint: "*",
  handler: notFoundHandler,
  requireAuth: false,
  tags: ["Not Found"],
};

const routes = [
  healthRoute,
  ...authRoutes,
  ...profileRoutes,
  ...usersRoutes,
  ...connectionsRoutes,
  ...feedRoutes,
  ...chatRoutes,
  ...vapidRoutes,
  wildCardRoute,
];

const generateRoutes = (app) => {
  routes.forEach((route) => {
    const authMiddleware = route.requireAuth ? requireAuth : noAuth;

    app[route.method.toLowerCase()](
      route.endpoint,
      authMiddleware,
      route.handler
    );
  });
};

module.exports = {
  generateRoutes,
  routes,
};
