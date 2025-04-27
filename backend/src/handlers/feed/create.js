const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");
const {
  sendNotificationPush,
} = require("../vapid/pushNotificationsHandler.js");
const { getConnectionIds } = require("../../repository/connection.repo.js");

const MAX_CONTENT_LENGTH = 280;

const createFeed = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const active_user = req.active_user;
  const content = req.data.content?.toString().trim() || null;

  if (!content) {
    return next(new HTTPError(400, "Content is required"));
  } else if (content.length > MAX_CONTENT_LENGTH) {
    return next(
      new HTTPError(
        400,
        `Content must not exceed ${MAX_CONTENT_LENGTH} characters`
      )
    );
  }
  try {
    await prisma.feed.create({
      data: {
        content: content,
        user_id: active_user.id,
        updated_at: new Date(),
      },
    });

    const connectionIds = await getConnectionIds(active_user.id);
    const notificationPayload = {
      title: "New Feed from " + active_user.username,
      body: `${active_user.username} has posted a new feed.`,
      url: "http://localhost:5173/profile/user/" + active_user.id,
    };

    for (const connectionId of connectionIds) {
      await sendNotificationPush({
        user_id: connectionId,
        ...notificationPayload,
      });
    }

    res.status(200).json({
      success: true,
      message: "Feed successfully created",
      body: {
        content: content,
      },
    });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = createFeed;
