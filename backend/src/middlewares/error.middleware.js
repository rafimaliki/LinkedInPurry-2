const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const response = {
    success: false,
    message: err.message || "An unexpected error occurred",
    error: err || null,
  };

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
