const verifyToken = require("../token/verifyToken");
const HTTPError = require("../class/HTTPError");

const requireAuth = (req, res, next) => {
  const authToken = req.cookies.auth_token || "";

  // console.log({ req_cookies: req.cookies });
  // console.log({ header: req.headers });

  if (!authToken) {
    return next(new HTTPError(401, "Token is required"));
  }

  const verified = verifyToken(authToken);

  if (!verified.user) {
    return next(new HTTPError(401, verified.error));
  }

  req.data = { ...req.body, ...req.params, ...req.query };
  req.active_user = verified.user;

  console.log({ active_user: verified.user, data: req.data, path: req.path });

  next();
};

const noAuth = (req, res, next) => {
  const authToken = req.cookies.auth_token || "";
  const verified = verifyToken(authToken);

  req.data = { ...req.body, ...req.params, ...req.query };
  req.active_user = verified.user;

  console.log({ active_user: verified.user, data: req.data, path: req.path });

  next();
};

module.exports = { requireAuth, noAuth };
