#!/usr/bin/env python3
"""
Cross-platform environment setup script for BidBolt
Replaces setup-env.sh and setup-env.bat
"""

import os
import shutil
import sys
from pathlib import Path

def print_banner():
    print("🚀 Setting up BidBolt environment variables...")

def setup_backend_env():
    print("📦 Setting up backend environment...")
    backend_dir = Path("../backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False

    os.chdir(backend_dir)
    env_example = Path(".env.example")
    env_file = Path(".env")

    if env_example.exists() and not env_file.exists():
        shutil.copy(env_example, env_file)
        print("✅ Backend .env file created from .env.example")
        print("📝 Please edit backend/.env with your actual values:")
        print("   - MONGODB_URI: Your MongoDB connection string")
        print("   - JWT_SECRET: A secure secret key for JWT tokens")
        print("   - Other values as needed")
    elif env_file.exists():
        print("⚠️ Backend .env file already exists, skipping")
    else:
        print("❌ Backend .env.example not found")
        return False

    os.chdir("..")
    return True

def setup_frontend_env():
    print("📦 Setting up frontend environment...")
    frontend_dir = Path("../frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False

    os.chdir(frontend_dir)
    env_example = Path(".env.example")
    env_file = Path(".env")

    if env_example.exists() and not env_file.exists():
        shutil.copy(env_example, env_file)
        print("✅ Frontend .env file created from .env.example")
        print("📝 Please edit frontend/.env with your actual values:")
        print("   - VITE_API_URL: Your backend API URL (e.g., http://localhost:5000/api/v1)")
    elif env_file.exists():
        print("⚠️ Frontend .env file already exists, skipping")
    else:
        print("❌ Frontend .env.example not found")
        return False

    os.chdir("..")
    return True

def print_next_steps():
    print("")
    print("🎉 Environment setup complete!")
    print("📋 Next steps:")
    print("   1. Edit the .env files with your actual values")
    print("   2. Run 'npm install' in both backend and frontend directories")
    print("   3. Start MongoDB if not already running")
    print("   4. Run 'npm run dev' in backend directory")
    print("   5. Run 'npm run dev' in frontend directory")
    print("")
    print("💡 For detailed instructions, see README.md")

def main():
    print_banner()
    backend_success = setup_backend_env()
    frontend_success = setup_frontend_env()

    if backend_success and frontend_success:
        print_next_steps()
        return 0
    else:
        print("❌ Environment setup failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
