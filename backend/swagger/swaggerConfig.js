const swaggerJSDoc = require("swagger-jsdoc");
const generateSwaggerPaths = require("./swaggerPaths");
const { routes } = require("../src/routes/api.routes");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LinkedInPurry API Documentation",
      version: "1.0.0",
      description: "API documentation for LinkedInPury REST API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        CookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "auth_token",
          description:
            "JWT token stored in auth_token cookie for authentication",
        },
      },
    },
    security: [{ CookieAuth: [] }],
    tags: [
      { name: "Health", description: "Health check related routes" },
      {
        name: "Auth",
        description: "Authentication and authorization related routes",
      },
      { name: "Profile", description: "Profile related routes" },
      { name: "Users", description: "Users related routes" },
      { name: "Connections", description: "Connections related routes" },
      { name: "Feed", description: "Feed related routes" },
      { name: "Chat", description: "Chat related routes" },
      { name: "Vapid", description: "Vapid related routes" },
    ],
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
swaggerSpec.paths = generateSwaggerPaths(routes);

module.exports = swaggerSpec;
