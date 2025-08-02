#!/bin/bash

# Setup script for AI Assistant App environment variables

echo "🤖 AI Assistant App - Environment Setup"
echo "========================================"

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy example file
if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ Created .env file from env.example"
else
    echo "❌ env.example file not found!"
    exit 1
fi

echo ""
echo "📝 Please edit the .env file with your actual API credentials:"
echo "   - VITE_API_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGFwaWF3MzgiLCJ0eXBlIjoiYXBpX2tleSIsImV4cCI6MTc4MzkxMzQwMCwiaWF0IjoxNzUyMzc3NDAwfQ.Xh3si37aJhN03pFPVb3bnX5DfPCnLMluy05Fs0qyGuk"
echo "   - VITE_API_BASE_URL: http://assistant.localhost"
echo "   - VITE_APP_TITLE: Nymia"
echo "   - VITE_APP_DESCRIPTION: App description (optional)"
echo ""
echo "🔧 You can edit .env with your preferred editor:"
echo "   nano .env"
echo "   vim .env"
echo "   code .env"
echo ""
echo "✅ Environment setup complete!"
echo "🚀 Run 'yarn dev' to start the development server" 