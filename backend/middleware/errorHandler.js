/**
 * Central error handler.
 * Any controller that calls `next(error)` lands here.
 */
const errorHandler = (err, req, res, next) => {
  // If status code was already set by the controller, use it. Otherwise 500.
  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  // Mongoose: bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      success: false,
      error: "Resource not found",
    });
  }

  // Mongoose: validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", "),
    });
  }

  // Mongo: duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Duplicate field value entered",
    });
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;