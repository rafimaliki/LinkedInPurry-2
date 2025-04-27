const { PrismaClient } = require("@prisma/client");
const HTTPError = require("../class/HTTPError");

const prisma = new PrismaClient();

const getUsernameAndProfilePict = async (user_id) => {
  const userdata = await prisma.users.findFirst({
    where: {
      id: user_id,
    },
    select: {
      id: true,
      username: true,
      profile_photo_path: true,
    },
  });

  const result = {
    id: userdata.id.toString(),
    username: userdata.username,
    profile_photo_path: userdata.profile_photo_path
      ? `http://localhost:3000${userdata.profile_photo_path}`
      : `http://localhost:3000/storage/_default_profile_photo.png`,
  };

  return result;
};
module.exports = {
  getUsernameAndProfilePict,
};
