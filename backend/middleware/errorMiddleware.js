// 404 - Route Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // PostgreSQL unique violation (email already exists etc.)
  if (err.code === "23505") {
    statusCode = 409;
    // err.detail looks like: Key (email)=(x@y.com) already exists
    const match = err.detail?.match(/Key \((.+?)\)/);
    const field = match ? match[1] : "Field";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // PostgreSQL foreign key violation
  if (err.code === "23503") {
    statusCode = 400;
    message = "Referenced resource does not exist";
  }

  // PostgreSQL check constraint violation (invalid enum value etc.)
  if (err.code === "23514") {
    statusCode = 400;
    message = "Invalid value provided for one of the fields";
  }

  // PostgreSQL invalid UUID format
  if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };