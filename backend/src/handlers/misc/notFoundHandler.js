const notFoundHandler = async (req, res) => {
  res.status(404).json({
    error: "Requested path is not available",
    path: req.originalUrl,
  });
};

module.exports = notFoundHandler;
