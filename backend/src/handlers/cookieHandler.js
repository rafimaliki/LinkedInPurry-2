const jwt = require("jsonwebtoken");

const jwtSecret = "6TubesB1sm1ll4h";

const cookieHandler = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = cookieHandler;
