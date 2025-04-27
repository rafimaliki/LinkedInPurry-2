const HTTPError = require("../../class/HTTPError");

const getUser = async (req, res, next) => {
  const active_user = req.active_user;
  res.status(200).json(active_user);
};

module.exports = getUser;
