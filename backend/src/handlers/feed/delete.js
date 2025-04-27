const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const deleteFeed = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const active_user = req.active_user;
  const post_id = Number(req.data.post_id) || null;

  if (!post_id) {
    return next(new HTTPError(400, "Post ID is required"));
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
        new HTTPError(403, "You are not authorized to delete this feed")
      );
    }

    await prisma.feed.delete({
      where: {
        id: post_id,
        user_id: active_user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Feed successfully deleted",
    });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = deleteFeed;
