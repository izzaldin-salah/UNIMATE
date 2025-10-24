#!/bin/bash
# Build script for Vercel deployment

echo "🚀 Starting UNIMATE build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run TypeScript compilation and build
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"