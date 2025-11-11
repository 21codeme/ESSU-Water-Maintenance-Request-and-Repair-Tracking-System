# Vercel Environment Variables Setup Script (PowerShell)
# Run this script to help set up environment variables

Write-Host "🚀 Vercel Deployment Setup Helper" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    $null = Get-Command vercel -ErrorAction Stop
} catch {
    Write-Host "⚠️  Vercel CLI is not installed." -ForegroundColor Yellow
    Write-Host "   Install it with: npm install -g vercel" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "Do you want to install it now? (y/n)"
    if ($install -eq "y" -or $install -eq "Y") {
        npm install -g vercel
    } else {
        Write-Host "Please install Vercel CLI first, then run this script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "📋 Setting up environment variables..." -ForegroundColor Cyan
Write-Host ""

# Get Supabase URL
$SUPABASE_URL = Read-Host "Enter your SUPABASE_URL"

# Get Supabase Service Role Key
$SUPABASE_SERVICE_ROLE_KEY = Read-Host "Enter your SUPABASE_SERVICE_ROLE_KEY"

# Get JWT Secret
$JWT_SECRET = Read-Host "Enter your JWT_SECRET (or press Enter to generate one)"
if ([string]::IsNullOrWhiteSpace($JWT_SECRET)) {
    # Generate random string
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $JWT_SECRET = [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
    Write-Host "Generated JWT_SECRET: $JWT_SECRET" -ForegroundColor Green
    Write-Host ""
}

# Set environment variables
Write-Host "🔧 Adding environment variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

$SUPABASE_URL | vercel env add SUPABASE_URL production
$SUPABASE_SERVICE_ROLE_KEY | vercel env add SUPABASE_SERVICE_ROLE_KEY production
$JWT_SECRET | vercel env add JWT_SECRET production
"production" | vercel env add NODE_ENV production

Write-Host ""
Write-Host "✅ Environment variables added!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "   SUPABASE_URL: $SUPABASE_URL"
Write-Host "   SUPABASE_SERVICE_ROLE_KEY: [hidden]"
Write-Host "   JWT_SECRET: $JWT_SECRET"
Write-Host "   NODE_ENV: production"
Write-Host ""
Write-Host "🚀 Ready to deploy! Run: vercel --prod" -ForegroundColor Green

