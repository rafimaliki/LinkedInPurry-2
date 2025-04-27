const logoutHandler = async (req, res, next) => {
  const response = {
    success: false,
    message: "",
  };

  res.clearCookie("auth_token");

  response.success = true;
  response.message = "User logged out successfully";

  res.status(200).json(response);
};

module.exports = logoutHandler;
