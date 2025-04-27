const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const HTTPError = require("../../class/HTTPError");

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Storage destination");
    cb(null, path.join(__dirname, "../../../storage"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

const editProfileHandler = async (req, res, next) => {
  const { user_id } = req.params;
  const { username, email, full_name, work_history, skills } = req.body;
  const profile_photo = req.file;
  const currentUserId = req.active_user.id;

  if (BigInt(currentUserId) !== BigInt(user_id)) {
    return next(new HTTPError(403, "Forbidden"));
  }

  try {
    let profilePhotoPath = "";

    if (profile_photo) {
      profilePhotoPath = `/storage/${profile_photo.filename}`;
    }

    const updateData = {
      username,
      email,
      full_name,
      work_history,
      skills,
    };

    if (profilePhotoPath) {
      updateData.profile_photo_path = profilePhotoPath;

      const user = await prisma.users.findUnique({
        where: { id: BigInt(user_id) },
      });

      if (user.profile_photo_path) {
        const oldProfilePhotoPath = path.join(
          __dirname,
          "../../../",
          user.profile_photo_path
        );

        if (fs.existsSync(oldProfilePhotoPath)) {
          fs.unlinkSync(oldProfilePhotoPath);
        }
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(user_id) },
      data: updateData,
    });

    const serializedUser = JSON.parse(
      JSON.stringify(updatedUser, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.status(200).json(serializedUser);
  } catch (error) {
    return next(error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = [upload.single("profile_photo"), editProfileHandler];
