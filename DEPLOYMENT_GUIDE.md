# Deployment Guide for Auction Platform

This guide explains how to deploy the Auction Platform application to production environments.

## Environment Configuration

### Frontend Environment Files

**Development (frontend/.env.development):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

**Production (frontend/.env.production):**
```env
VITE_API_URL=https://your-production-api-domain.com/api/v1
```

### Backend Environment Files

**Development (backend/.env.development):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auction-platform-dev
JWT_SECRET=your-development-jwt-secret-key-change-this-in-production
NODE_ENV=development
```

**Production (backend/.env.production):**
```env
PORT=5000
MONGODB_URI=your-production-mongodb-connection-string
JWT_SECRET=your-strong-production-jwt-secret-key-must-be-changed
NODE_ENV=production
```

## Deployment Steps

### 1. Backend Deployment

1. **Set up production environment variables:**
   ```bash
   cd backend
   # Edit backend/.env.production with your actual production values
   ```

2. **Install dependencies:**
   ```bash
   npm install --production
   ```

3. **Start the production server:**
   ```bash
   NODE_ENV=production npm start
   ```

### 2. Frontend Deployment

1. **Set production API URL:**
   ```bash
   cd frontend
   # Edit frontend/.env.production with your actual production API URL
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **The built files will be in the `dist/` directory, ready for deployment to any static hosting service**

### 3. Environment Variable Management

**For production deployment, set these environment variables:**

#### Backend Production Variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string or production MongoDB URL
- `JWT_SECRET`: A strong, random secret key for JWT token signing
- `PORT`: Port to run the backend server (default: 5000)
- `NODE_ENV`: Set to "production"

#### Frontend Production Variables:
- `VITE_API_URL`: The URL of your deployed backend API (e.g., `https://api.yourdomain.com/api/v1`)

## Platform-Specific Deployment

### Heroku Deployment

**Backend:**
```bash
# Set environment variables in Heroku dashboard
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production

# Deploy
git subtree push --prefix backend heroku main
```

**Frontend:**
```bash
# Build and deploy to Netlify/Vercel
npm run build
# Upload dist/ folder to your hosting service
```

### Docker Deployment

Create a `Dockerfile` in the backend directory:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t auction-backend .
docker run -p 5000:5000 --env-file backend/.env.production auction-backend
```

## Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret for production
2. **MongoDB**: Use MongoDB Atlas or a secure MongoDB instance with authentication
3. **Environment Variables**: Never commit .env files to version control
4. **CORS**: Configure CORS to allow only your frontend domain
5. **HTTPS**: Always use HTTPS in production

## Monitoring and Logging

In production, consider adding:
- Error tracking (Sentry, etc.)
- Performance monitoring
- Log aggregation
- Health check endpoints

## Troubleshooting

1. **API Connection Issues**: Verify `VITE_API_URL` points to the correct backend URL
2. **Database Connection**: Check MongoDB connection string and network access
3. **Environment Variables**: Ensure all required variables are set in production
4. **CORS Errors**: Verify backend CORS configuration allows your frontend domain

## Example Production Values

**Backend .env.production:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auction-platform
JWT_SECRET=your-super-secure-jwt-secret-with-at-least-32-characters
NODE_ENV=production
```

**Frontend .env.production:**
```env
VITE_API_URL=https://api.auctionplatform.com/api/v1
```

Remember to replace all placeholder values with your actual production configuration before deploying.
