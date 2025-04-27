const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addPushSubscription = async (user_id, subscription) => {
  try {
    await prisma.push_subscriptions.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        keys: JSON.stringify(subscription.keys),
        user_id,
      },
      create: {
        endpoint: subscription.endpoint,
        keys: JSON.stringify(subscription.keys),
        user_id,
      },
    });
    return true;
  } catch (error) {
    console.error("Error adding subscription:", error);
    throw error;
  }
};

const getPushSubscriptionsByUserId = async (user_id) => {
  try {
    return await prisma.push_subscriptions.findMany({
      where: { user_id },
    });
  } catch (error) {
    console.error("Error retrieving subscriptions by user ID:", error);
    throw error;
  }
};

module.exports = {
  addPushSubscription,
  getPushSubscriptionsByUserId,
};
