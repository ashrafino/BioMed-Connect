#!/bin/bash

# Netlify Deployment Script
# This script helps you deploy your app to Netlify

set -e

echo "🚀 Netlify Deployment Helper"
echo "=============================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed."
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed successfully!"
    echo ""
fi

# Check if user is logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
    echo ""
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  GEMINI_API_KEY environment variable is not set."
    echo "You can set it now or configure it later in Netlify dashboard."
    read -p "Enter your Gemini API key (or press Enter to skip): " api_key
    
    if [ ! -z "$api_key" ]; then
        export GEMINI_API_KEY="$api_key"
        echo "✅ API key set for this session"
    fi
    echo ""
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy
echo "🚀 Deploying to Netlify..."
echo ""
read -p "Deploy to production? (y/n): " deploy_prod

if [ "$deploy_prod" = "y" ] || [ "$deploy_prod" = "Y" ]; then
    netlify deploy --prod
    
    # Set environment variable if provided
    if [ ! -z "$GEMINI_API_KEY" ]; then
        echo ""
        echo "🔧 Setting GEMINI_API_KEY environment variable..."
        netlify env:set GEMINI_API_KEY "$GEMINI_API_KEY"
    fi
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Opening your site..."
    netlify open:site
else
    netlify deploy
    echo ""
    echo "✅ Draft deployment complete!"
    echo "📝 Review the preview and deploy to production when ready."
fi

echo ""
echo "=============================="
echo "🎉 Done!"
