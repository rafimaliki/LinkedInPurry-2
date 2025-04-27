const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const HTTPError = require("../../class/HTTPError");

const profileHandler = async (req, res, next) => {
  const active_user = req.active_user;
  let user_id = req.data?.user_id;

  if (
    user_id === undefined ||
    user_id === null ||
    user_id === "" ||
    user_id === "undefined"
  ) {
    if (!active_user) {
      return next(new HTTPError(401, "Unauthorized"));
    }
    user_id = active_user.id;
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return next(new HTTPError(404, "User not found"));
    }

    const connectedUserIds = await prisma.connection.findMany({
      where: {
        OR: [{ from_id: user_id }, { to_id: user_id }],
      },
      select: {
        from_id: true,
        to_id: true,
      },
    });

    const connectedIds = connectedUserIds.flatMap((connection) => [
      connection.from_id.toString(),
      connection.to_id.toString(),
    ]);

    // Fetch 2nd and 3rd connections
    const secondConnections = await prisma.connection.findMany({
      where: {
        OR: [
          { from_id: { in: connectedIds } },
          { to_id: { in: connectedIds } },
        ],
      },
      select: {
        from_id: true,
        to_id: true,
      },
    });

    const secondConnectionIds = secondConnections.flatMap((connection) => [
      connection.from_id.toString(),
      connection.to_id.toString(),
    ]);

    const thirdConnections = await prisma.connection.findMany({
      where: {
        OR: [
          { from_id: { in: secondConnectionIds } },
          { to_id: { in: secondConnectionIds } },
        ],
      },
      select: {
        from_id: true,
        to_id: true,
      },
    });

    const thirdConnectionIds = thirdConnections.flatMap((connection) => [
      connection.from_id.toString(),
      connection.to_id.toString(),
    ]);

    const allRecommendedIds = [
      ...new Set([...secondConnectionIds, ...thirdConnectionIds]),
    ].filter((id) => !connectedIds.includes(id) && id !== user_id.toString());

    const recommendations = await prisma.users.findMany({
      where: {
        id: {
          in: allRecommendedIds.map((id) => BigInt(id)),
        },
      },
      take: 5,
    });

    const connectionCount = await prisma.connection.count({
      where: {
        to_id: user_id,
      },
    });

    const isConnected = active_user
      ? await prisma.connection.findFirst({
          where: {
            OR: [
              { from_id: active_user.id, to_id: user_id },
              { from_id: user_id, to_id: active_user.id },
            ],
          },
        })
      : false;

    const isOwnProfile = active_user ? active_user.id === user_id : false;

    const isAuthenticated = active_user ? true : false;

    const response = {
      success: true,
      message: "Profile fetched successfully",
      body: {
        id: user.id.toString(),
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        work_history: user.work_history,
        skills: user.skills,
        connection_count: connectionCount.toString(),
        profile_photo: user.profile_photo_path
          ? `http://localhost:3000${user.profile_photo_path}`
          : `http://localhost:3000/storage/_default_profile_photo.png`,
        isConnected: !!isConnected,
        isOwnProfile: isOwnProfile,
        isAuthenticated: isAuthenticated,
        recommendations: recommendations.map((rec) => ({
          id: rec.id.toString(),
          username: rec.username,
          profile_photo: rec.profile_photo_path
            ? `http://localhost:3000${rec.profile_photo_path}`
            : `http://localhost:3000/storage/_default_profile_photo.png`,
        })),
      },
    };

    if (isConnected || isOwnProfile) {
      const relevantPosts = await prisma.feed.findMany({
        where: {
          user_id: user_id,
        },
      });

      response.body.relevant_posts = relevantPosts.map((post) => ({
        id: post.id.toString(),
        created_at: post.created_at,
        updated_at: post.updated_at,
        content: post.content,
        user_id: post.user_id.toString(),
      }));
    }

    return res.status(200).json(response);
  } catch (error) {
    if (!res.headersSent) {
      return next(error);
    }
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = profileHandler;
