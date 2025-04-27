const Prisma = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const createRequest = async (req, res, next) => {
  const prisma = new Prisma.PrismaClient();

  const from_id = req.active_user.id;
  const to_id = req.data.to_id;

  try {
    if (!to_id) {
      return next(new HTTPError(400, "Missing to_id"));
    }

    const existingRequest = await prisma.connection_request.findFirst({
      where: {
        from_id: from_id,
        to_id: to_id,
      },
    });

    if (existingRequest) {
      return next(new HTTPError(400, "Request already exists"));
    }

    await prisma.connection_request.create({
      data: {
        from_id: from_id,
        to_id: to_id,
        created_at: new Date(),
      },
    });

    res.status(201).json({ message: "Request created" });
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = createRequest;
