@echo off
echo 🚀 Setting up BidBolt environment variables...

REM Backend setup
echo 📦 Setting up backend environment...
cd backend
if exist .env.example if not exist .env (
    copy .env.example .env >nul
    echo ✅ Backend .env file created from .env.example
    echo 📝 Please edit backend\.env with your actual values:
    echo    - MONGODB_URI: Your MongoDB connection string
    echo    - JWT_SECRET: A secure secret key for JWT tokens
    echo    - Other values as needed
) else (
    if exist .env (
        echo ⚠️ Backend .env file already exists, skipping
    ) else (
        echo ❌ Backend .env.example not found
    )
)
cd ..

REM Frontend setup
echo 📦 Setting up frontend environment...
cd frontend
if exist .env.example if not exist .env (
    copy .env.example .env >nul
    echo ✅ Frontend .env file created from .env.example
    echo 📝 Please edit frontend\.env with your actual values:
    echo    - VITE_API_URL: Your backend API URL (e.g., http://localhost:5000/api/v1)
) else (
    if exist .env (
        echo ⚠️ Frontend .env file already exists, skipping
    ) else (
        echo ❌ Frontend .env.example not found
    )
)
cd ..

echo.
echo 🎉 Environment setup complete!
echo 📋 Next steps:
echo    1. Edit the .env files with your actual values
echo    2. Run 'npm install' in both backend and frontend directories
echo    3. Start MongoDB if not already running
echo    4. Run 'npm run dev' in backend directory
echo    5. Run 'npm run dev' in frontend directory
echo.
echo 💡 For detailed instructions, see README.md
pause
