const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const deleteConnection = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const to_id = req.data.to_id;
  const from_id = req.active_user.id;

  try {
    if (!from_id || !to_id) {
      return next(new HTTPError(400, "Missing from_id or to_id"));
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        from_id: from_id,
        to_id: to_id,
      },
    });

    if (!existingConnection) {
      return next(new HTTPError(404, "Request does not exist"));
    }

    await prisma.$transaction([
      prisma.connection.delete({
        where: {
          from_id_to_id: {
            from_id: from_id,
            to_id: to_id,
          },
        },
      }),
      prisma.connection.delete({
        where: {
          from_id_to_id: {
            from_id: to_id,
            to_id: from_id,
          },
        },
      }),
    ]);

    res.status(200).json({ message: "Request declined successfully" });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = deleteConnection;
