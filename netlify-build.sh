#!/bin/bash
set -e

echo "🔧 Starting Netlify build..."

# Clean install to avoid any caching issues
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🏗️  Building project..."
npm run build

echo "✅ Build complete!"
