const {
  subscribe,
  sendPushNotification,
} = require("../handlers/vapid/pushNotificationsHandler");

const vapidRoutes = [
  {
    method: "POST",
    endpoint: "/api/vapid/subscribe",
    handler: subscribe,
    requireAuth: false,
    params: {
      body: {
        subscription: {
          type: "object",
          required: true,
          description: "The push subscription object from the client",
        },
        user_id: {
          type: "string",
          required: true,
          description: "The user ID to associate with the subscription",
        },
      },
    },
    tags: ["Vapid"],
  },

  {
    method: "POST",
    endpoint: "/api/vapid/send-notification",
    handler: sendPushNotification,
    requireAuth: false,
    params: {
      body: {
        user_id: {
          type: "string",
          required: true,
          description: "The user ID to send the notification to",
        },
      },
    },
    tags: ["Vapid"],
  },
];

module.exports = vapidRoutes;
