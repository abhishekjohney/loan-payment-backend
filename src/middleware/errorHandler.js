/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns a standardized JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // PostgreSQL specific errors or MySQL specific duplicate entries
  if (err.code === '23505' || err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry - resource already exists',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // PostgreSQL specific errors or MySQL specific foreign key violations
  if (
    err.code === '23503' || 
    err.code === 'ER_NO_REFERENCED_ROW' || 
    err.code === 'ER_NO_REFERENCED_ROW_2' || 
    err.errno === 1216 || 
    err.errno === 1452
  ) {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource not found (foreign key constraint failed)',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
