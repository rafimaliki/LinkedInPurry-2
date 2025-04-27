const { PrismaClient } = require("@prisma/client");
const HTTPError = require("../class/HTTPError");

const prisma = new PrismaClient();

const getConnectionIds = async (user_id) => {
  const connections = await prisma.connection.findMany({
    where: {
      from_id: user_id,
    },
  });

  return connections.map((connection) => connection.to_id.toString());
};
module.exports = {
  getConnectionIds,
};
