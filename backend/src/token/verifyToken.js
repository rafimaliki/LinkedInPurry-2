const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (token) => {
  if (!token || token === "undefined") {
    return { user: null, error: "Token is undefined or empty" };
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { id, username, email } = decoded;

    if (!id || !username || !email) {
      return { user: null, error: "Token is invalid" };
    }

    return { user: { id, username, email }, error: null };
  } catch (err) {
    return { user: null, error: "Token is invalid or expired" };
  }
};

module.exports = verifyToken;
