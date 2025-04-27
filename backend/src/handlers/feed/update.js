const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const MAX_CONTENT_LENGTH = 280;

const updateFeed = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const active_user = req.active_user;
  const content = req.data.content?.toString().trim() || null;
  const post_id = Number(req.data.post_id) || null;

  if (!post_id) {
    return next(new HTTPError(400, "Post ID is required"));
  } else if (!content) {
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
    const feed = await prisma.feed.findFirst({
      where: {
        id: post_id,
      },
    });

    if (!feed) {
      return next(new HTTPError(404, "Feed not found"));
    } else if (feed.user_id.toString() !== active_user.id.toString()) {
      return next(
        new HTTPError(403, "You are not authorized to update this feed")
      );
    }

    const updatedFeed = await prisma.feed.update({
      where: {
        id: post_id,
        user_id: active_user.id,
      },
      data: {
        content: content,
        updated_at: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Feed successfully updated",
      body: {
        newFeed: {
          ...updatedFeed,
          id: post_id,
          user_id: active_user.id,
        },
      },
    });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = updateFeed;
