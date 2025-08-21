# Backend API Guide

## Overview
This backend provides a complete RESTful API with authentication, user management, and proper error handling.

## Directory Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### User Routes
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/profile` - Get current user profile

### Health Check
- `GET /api/health` - Server health check
- `GET /api/v1` - API documentation

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get all users
```bash
curl http://localhost:5000/api/users
```

### Get user profile (authenticated)
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer mock-jwt-token-1"
```

## Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes
- General API endpoints: 100 requests per 15 minutes

## Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Start production server: `npm start`

## Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
```

## Testing
Test the endpoints using the provided curl commands or tools like Postman.
