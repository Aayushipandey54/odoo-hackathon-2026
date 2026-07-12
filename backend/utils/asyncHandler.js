/**
 * Async Error Handler Wrapper
 * Wraps express route controllers to automatically catch unhandled promise rejections
 * and pass them to the global error handler middleware.
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
