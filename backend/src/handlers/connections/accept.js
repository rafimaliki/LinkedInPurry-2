const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const acceptRequest = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const from_id = req.data.from_id;
  const to_id = req.active_user.id;

  try {
    if (!from_id || !to_id) {
      return next(new HTTPError(400, "Missing from_id or to_id"));
    }

    const existingRequest = await prisma.connection_request.findFirst({
      where: {
        from_id: from_id,
        to_id: to_id,
      },
    });

    if (!existingRequest) {
      return next(new HTTPError(404, "Request does not exist"));
    }

    await prisma.$transaction([
      prisma.connection_request.delete({
        where: {
          from_id_to_id: {
            from_id: from_id,
            to_id: to_id,
          },
        },
      }),
      prisma.connection.create({
        data: {
          from_id: from_id,
          to_id: to_id,
          created_at: new Date(),
        },
      }),
      prisma.connection.create({
        data: {
          from_id: to_id,
          to_id: from_id,
          created_at: new Date(),
        },
      }),
    ]);

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = acceptRequest;
