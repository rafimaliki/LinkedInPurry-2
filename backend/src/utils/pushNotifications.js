const { getPushSubscriptionsByUserId } = require("../repository/push.repo");
const webPush = require("web-push");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const initializeVapid = (vapidKeys) => {
  webPush.setVapidDetails(
    "mailto:test@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
};

const sendNotification = async (user_id, notificationPayload) => {
  try {
    console.log("Sending..");
    const subscriptions = await getPushSubscriptionsByUserId(user_id);
    if (!subscriptions.length) {
      console.log("User has no subscriptions.");
      return;
    }

    const results = await Promise.allSettled(
      subscriptions.map((subscription) => {
        console.log({
          endpoint: subscription.endpoint,
          key: JSON.parse(subscription.keys),
        });
        webPush
          .sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: JSON.parse(subscription.keys),
            },
            JSON.stringify(notificationPayload)
          )
          .catch((error) => {
            if (error.statusCode === 410) {
              console.log(
                `Subscription expired or invalid: ${subscription.endpoint}`
              );
              return prisma.push_subscriptions.delete({
                where: { endpoint: subscription.endpoint },
              });
            }
            throw error;
          });
      })
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to send notification to subscription ${index}:`,
          result.reason
        );
      }
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};

module.exports = {
  initializeVapid,
  sendNotification,
};
