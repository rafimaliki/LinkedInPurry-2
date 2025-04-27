const { PrismaClient } = require("@prisma/client");
const HTTPError = require("../../class/HTTPError");

const usersListHandler = async (req, res, next) => {
  const prisma = new PrismaClient();

  const active_user = req.active_user;
  const data = req.data;

  data.search_term = data.search_term || "";
  data.filter = data.filter || "ALL";
  data.connected_with = Number(data.connected_with) || null;

  try {
    let users = await prisma.users.findMany({
      where: {
        id: {
          not: data.connected_with
            ? data.connected_with
            : active_user
            ? active_user.id
            : 0,
        },
        username: {
          contains: data.search_term,
          mode: "insensitive",
        },
      },
    });

    if (data.connected_with && !isNaN(data.connected_with)) {
      const filteredUsers = await Promise.all(
        users.map(async (user) => {
          const isConnected = await prisma.connection.findFirst({
            where: {
              OR: [
                { from_id: data.connected_with, to_id: user.id },
                { from_id: user.id, to_id: data.connected_with },
              ],
            },
          });
          return isConnected ? user : null;
        })
      );
      users = filteredUsers.filter((user) => user !== null);
    }

    const results = await Promise.all(
      users.map(async (user) => {
        let connected, requestFromThem, requestFromMe;

        if (active_user) {
          connected = await prisma.connection.findFirst({
            where: {
              OR: [
                { from_id: active_user.id, to_id: user.id },
                { from_id: user.id, to_id: active_user.id },
              ],
            },
          });

          if (!connected) {
            requestFromThem = await prisma.connection_request.findFirst({
              where: {
                from_id: user.id,
                to_id: active_user.id,
              },
            });

            if (!requestFromThem) {
              requestFromMe = await prisma.connection_request.findFirst({
                where: {
                  from_id: active_user.id,
                  to_id: user.id,
                },
              });
            }
          }
        }

        let connection_status;

        if (!active_user) {
          connection_status = "NOT_LOGGED_IN";
        } else if (connected) {
          connection_status = "CONNECTED";
        } else if (requestFromThem) {
          connection_status = "WAITING_FOR_YOU";
        } else if (requestFromMe) {
          connection_status = "WAITING_FOR_THEM";
        } else if (user.id == active_user.id) {
          connection_status = "YOU";
        } else {
          connection_status = "NOT_CONNECTED";
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          work_history: user.work_history,
          skills: user.skills,
          profile_photo_path: user.profile_photo_path
            ? `http://localhost:3000${user.profile_photo_path}`
            : `http://localhost:3000/storage/_default_profile_photo.png`,

          connection_status: connection_status,
        };
      })
    );

    const filteredResults =
      data.filter === "ALL"
        ? results
        : results.filter((user) => user.connection_status === data.filter);

    res.status(200).json({
      success: true,
      message: "success getting users list",
      body: filteredResults,
    });
  } catch (error) {
    return next(new HTTPError(500, "Internal Server Error", error));
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = usersListHandler;
