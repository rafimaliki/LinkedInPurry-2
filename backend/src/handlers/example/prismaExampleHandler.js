const { PrismaClient } = require("@prisma/client");

const prismaExampleHandler = async (req, res) => {
  const prisma = new PrismaClient();

  try {
    // Query
    const data = await prisma.users.findMany();

    // Serialize data to avoid bigint serialization error
    const serializedData = data.map((item) => {
      return Object.fromEntries(
        Object.entries(item).map(([key, value]) =>
          typeof value === "bigint" ? [key, value.toString()] : [key, value]
        )
      );
    });

    // Respond with data
    res.status(200).json({ data: serializedData });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  } finally {
    // Disconnect
    await prisma.$disconnect();
  }
};

module.exports = prismaExampleHandler;
