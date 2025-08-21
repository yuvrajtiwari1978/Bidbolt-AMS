// Standardized API response format
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static error(res, message = 'Error', statusCode = 500, data = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  static badRequest(res, message = 'Bad request') {
    return this.error(res, message, 400);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  static validationError(res, errors) {
    return this.error(res, 'Validation failed', 422, errors);
  }

  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, 500);
  }
}

export default ApiResponse;
