// 404 handler for unmatched routes
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Error Handler
export const errorHandler = (error, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    success: false,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};
