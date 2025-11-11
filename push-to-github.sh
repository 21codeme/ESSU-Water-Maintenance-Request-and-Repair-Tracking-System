#!/bin/bash

echo "========================================"
echo "  Push to GitHub - ESSU Water Maintenance"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed!"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi

echo "[1/4] Checking git status..."
git status
echo ""

echo "[2/4] Adding all changes..."
git add .
echo ""

echo "[3/4] Committing changes..."
git commit -m "Update for Vercel deployment with Supabase Storage support"
echo ""

echo "[4/4] Pushing to GitHub..."
echo ""
echo "Please enter your GitHub credentials when prompted."
echo ""

# Get current branch
BRANCH=$(git branch --show-current)
if [ -z "$BRANCH" ]; then
    BRANCH="main"
fi

git push origin $BRANCH

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Push failed!"
    echo ""
    echo "Possible reasons:"
    echo "- Not authenticated with GitHub"
    echo "- Wrong branch name"
    echo "- No remote repository configured"
    echo ""
    echo "To fix:"
    echo "1. Check your branch: git branch"
    echo "2. Check remote: git remote -v"
    echo "3. If no remote, add it: git remote add origin YOUR_REPO_URL"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  SUCCESS! Changes pushed to GitHub"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your repository"
    echo "3. Deploy!"
    echo ""
fi

