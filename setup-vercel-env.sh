#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script to help set up environment variables

echo "🚀 Vercel Deployment Setup Helper"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI is not installed."
    echo "   Install it with: npm install -g vercel"
    echo ""
    read -p "Do you want to install it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
    else
        echo "Please install Vercel CLI first, then run this script again."
        exit 1
    fi
fi

echo "📋 Setting up environment variables..."
echo ""

# Get Supabase URL
read -p "Enter your SUPABASE_URL: " SUPABASE_URL
echo ""

# Get Supabase Service Role Key
read -p "Enter your SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
echo ""

# Get JWT Secret
read -p "Enter your JWT_SECRET (or press Enter to generate one): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
    echo ""
fi

# Set environment variables
echo "🔧 Adding environment variables to Vercel..."
echo ""

echo "$SUPABASE_URL" | vercel env add SUPABASE_URL production
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "$JWT_SECRET" | vercel env add JWT_SECRET production
echo "production" | vercel env add NODE_ENV production

echo ""
echo "✅ Environment variables added!"
echo ""
echo "📝 Summary:"
echo "   SUPABASE_URL: $SUPABASE_URL"
echo "   SUPABASE_SERVICE_ROLE_KEY: [hidden]"
echo "   JWT_SECRET: $JWT_SECRET"
echo "   NODE_ENV: production"
echo ""
echo "🚀 Ready to deploy! Run: vercel --prod"

