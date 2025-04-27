const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const DEFAULT_LIMIT = 5;

const feedList = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const limit = Number(req.query.limit) || DEFAULT_LIMIT;
  const cursor = req.query.cursor
    ? { id: Number(req.query.cursor) }
    : undefined;

  const active_user = req.active_user;

  try {
    const connectedUserIds = await prisma.connection.findMany({
      where: {
        from_id: active_user.id,
      },
      select: {
        to_id: true,
      },
    });

    const userIds = connectedUserIds.map((connection) =>
      connection.to_id.toString()
    );
    userIds.push(active_user.id);

    const feedData = await prisma.feed.findMany({
      where: {
        user_id: {
          in: userIds,
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit + 1, // Fetch one extra item to determine the next cursor
      ...(cursor && { skip: 1, cursor }), // Skip the cursor item
    });

    const hasNextPage = feedData.length > limit;
    if (hasNextPage) {
      feedData.pop(); // Remove the extra item
    }

    const cleanedFeedData = feedData.map((feed) => {
      return {
        id: feed.id.toString(),
        created_at: feed.created_at,
        updated_at: feed.updated_at,
        content: feed.content,
        user_id: feed.user_id.toString(),
      };
    });

    res.status(200).json({
      success: true,
      message: `Success getting ${cleanedFeedData.length}/${limit} feeds`,
      body: {
        cleanedFeedData: cleanedFeedData,
        cursor: hasNextPage
          ? cleanedFeedData[cleanedFeedData.length - 1].id
          : null,
      },
      nextCursor: hasNextPage
        ? cleanedFeedData[cleanedFeedData.length - 1].id
        : null,
    });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = feedList;
