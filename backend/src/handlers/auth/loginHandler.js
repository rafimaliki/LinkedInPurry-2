const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HTTPError = require("../../class/HTTPError");

const jwtSecret = process.env.JWT_SECRET;

const loginHandler = async (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  const { identifier } = req.body;

  const response = {
    success: false,
    message: "",
    body: {
      token: "",
    },
  };

  console.log("here1");

  const prisma = new PrismaClient();

  console.log("here2");
  try {
    var user;

    console.log("here3");

    if (emailOrUsername) {
      user = await prisma.users.findFirst({
        where: {
          OR: [
            {
              username: emailOrUsername,
            },
            {
              email: emailOrUsername,
            },
          ],
        },
      });
      console.log("user fetched:", user); // Add this line to see the result
    }

    console.log("");

    // } else if (identifier) {
    //   user = await prisma.users.findFirst({
    //     where: {
    //       OR: [
    //         {
    //           username: identifier,
    //         },
    //         {
    //           email: identifier,
    //         },
    //       ],
    //     },
    //   });
    // }

    console.log("here4");

    if (!user) {
      return next(new HTTPError(404, "User not found"));
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return next(new HTTPError(401, "Invalid passwords"));
    }

    const payload = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      full_name: user.full_name,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    response.success = true;
    response.message = "User logged successfully";
    response.body.token = token.toString();
    response.body.user = payload;

    res.status(200).json(response);
  } catch (error) {
    return next(new HTTPError(500, "An error occurred while fetching data."));
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = loginHandler;
