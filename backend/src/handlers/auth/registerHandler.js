const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HTTPError = require("../../class/HTTPError");

const jwtSecret = process.env.JWT_SECRET;
const salt_rounds = process.env.SALT_ROUNDS;

const registerHandler = async (req, res, next) => {
  const { username, email, fullname, password } = req.body;

  const prisma = new PrismaClient();

  const response = {
    success: false,
    message: "",
    body: {
      token: "",
    },
  };

  try {
    const hashedPassword = await bcrypt.hash(password, Number(salt_rounds));

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: username,
            },
          },
          {
            email: {
              equals: email,
            },
          },
        ],
      },
    });

    if (existingUser) {
      return next(new HTTPError(409, "User already exists"));
    }

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
        full_name: fullname,
        profile_photo_path: "",
        updated_at: new Date(),
        created_at: new Date(),
      },
    });

    const payload = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      fullname: user.full_name,
    };

    const token = jwt.sign(payload, jwtSecret);

    response.success = true;
    response.message = "User created successfully";
    response.body.token = token;

    res.status(200).json(response);
  } catch (error) {
    return next(new HTTPError(500, "An error occurred while creating user."));
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = registerHandler;
