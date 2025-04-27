const { PrismaClient } = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const connectionsReqListHandler = async (req, res, next) => {
  const prisma = new PrismaClient();

  const active_user = req.active_user;
  const data = req.data;

  data.search_term = data.search_term || "";

  try {
    const target_id = await prisma.connection_request.findMany({
      select: {
        from_id: true,
        to_id: true,
      },
      where: {
        to_id: active_user.id,
      },
    });

    const users = await prisma.users.findMany({
      where: {
        id: {
          in: target_id.map((user) => user.from_id),
        },
        username: {
          contains: data.search_term,
          mode: "insensitive",
        },
      },
    });

    const results = users.map((user) => ({
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      profile_photo_path: user.profile_photo_path
        ? `http://localhost:3000${user.profile_photo_path}`
        : `http://localhost:3000/storage/_default_profile_photo.png`,
      connection_status: "WAITING_FOR_YOU",
    }));

    res.status(200).json({
      success: true,
      message: "success getting connection requests list",
      body: results,
    });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = connectionsReqListHandler;
