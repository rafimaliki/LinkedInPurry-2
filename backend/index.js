const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const initializeSocket = require("./src/socket/socket");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerConfig");

const { generateRoutes } = require("./src/routes/api.routes");
const errorMiddleware = require("./src/middlewares/error.middleware");
const {
  initializeVapid,
  addSubscription,
  sendNotification,
} = require("./src/utils/pushNotifications");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/storage", express.static(path.join(__dirname, "storage")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

generateRoutes(app);

app.use(errorMiddleware);

const server = http.createServer(app);
initializeSocket(server);

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

initializeVapid(vapidKeys);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("API documentation available at http://localhost:3000/api-docs");
});
