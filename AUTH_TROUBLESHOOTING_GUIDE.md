# Authentication System Troubleshooting Guide

## Common Issues and Solutions

### 1. "Login Failed" or "Registration Failed" Errors

**Possible Causes:**
- Validation errors in input data
- Database connection issues
- Environment variables not set properly
- CORS configuration problems

**Solutions:**

#### Check Environment Variables
Ensure your `.env` file has the following variables:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auctionapp
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

#### Test Database Connection
Run the health check endpoint:
```bash
curl http://localhost:5000/api/health
```
Should return database status as "connected"

#### Test Validation
Use the test script to verify validation:
```bash
cd backend
node test_auth_fixed.js
```

### 2. MongoDB Connection Issues

**Check if MongoDB is running:**
```bash
# On Windows
net start MongoDB

# On macOS/Linux
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

**Verify MongoDB connection string:**
- Default: `mongodb://localhost:27017/auctionapp`
- Ensure MongoDB is accessible on port 27017

### 3. CORS Issues (Frontend can't connect to backend)

**Symptoms:**
- Network errors in browser console
- "Blocked by CORS policy" errors

**Solutions:**
- Ensure frontend is running on `http://localhost:5173`
- Check `FRONTEND_URL` in `.env` file
- Restart backend after changing CORS settings

### 4. JWT Token Issues

**Symptoms:**
- "Invalid token" errors
- Authentication failures after successful login

**Solutions:**
- Ensure `JWT_SECRET` is set in `.env`
- The secret should be a long, random string
- Restart backend after changing JWT secret

## Step-by-Step Testing

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```
Should return:
```json
{
  "success": true,
  "message": "Backend server is running",
  "database": {
    "status": "connected",
    "type": "MongoDB",
    "connected": true
  }
}
```

### 3. Run Authentication Tests
```bash
node test_auth_fixed.js
```

### 4. Test Manual Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "test123@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 5. Test Manual Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test123@example.com",
    "password": "password123"
  }'
```

## Common Error Messages

### "Validation failed"
- Check input data format
- Email must be valid format
- Password must be at least 6 characters
- All required fields must be provided

### "User with this email already exists"
- Use a different email address
- The email is already registered

### "Invalid credentials"
- Check email and password combination
- Password might be incorrect

### "MongoDB connection error"
- Ensure MongoDB is running
- Check connection string in `.env`

## Frontend Integration

### Check Frontend Configuration
Ensure frontend `.env` has:
```bash
VITE_API_URL=http://localhost:5000/api
```

### Test Frontend-Backend Connection
1. Start both frontend and backend
2. Open browser developer tools
3. Check Network tab for API calls
4. Look for CORS errors or 4xx/5xx responses

## Debug Mode

Enable detailed logging by setting in `.env`:
```bash
NODE_ENV=development
DEBUG=true
```

This will provide more detailed error messages and stack traces.

## Reset Options

### Clear Database (if needed)
```bash
# Connect to MongoDB
mongo

# Switch to auctionapp database
use auctionapp

# Clear users collection
db.users.deleteMany({})
```

### Restart Services
```bash
# Stop and restart both services
# Backend: Ctrl+C and npm run dev
# Frontend: Ctrl+C and npm run dev
# MongoDB: restart the service
```

## Getting Help

If issues persist:
1. Check all error messages in console
2. Verify all environment variables
3. Ensure all services are running
4. Test with the provided test scripts
5. Check MongoDB connection status

**Remember:** Always restart the backend server after making changes to `.env` files or configuration.
