# 📤 How to Push to GitHub

## Quick Method (Use Script)

### Windows:
1. Double-click: `push-to-github.bat`
2. Or run in PowerShell: `.\push-to-github.ps1`

### Mac/Linux:
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

---

## Manual Method (Step by Step)

### Step 1: Check Git Status
```bash
git status
```

### Step 2: Add All Changes
```bash
git add .
```

### Step 3: Commit Changes
```bash
git commit -m "Update for Vercel deployment with Supabase Storage support"
```

### Step 4: Push to GitHub
```bash
git push origin main
```

**Note**: If your branch is `master` instead of `main`:
```bash
git push origin master
```

---

## If You Don't Have a GitHub Repository Yet

### Step 1: Create Repository on GitHub
1. Go to https://github.com
2. Click **New repository**
3. Name: `essu-water-maintenance` (or any name)
4. Don't initialize with README
5. Click **Create repository**

### Step 2: Connect Local Repository
```bash
# Check if remote exists
git remote -v

# If no remote, add it (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or if you prefer SSH:
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

### Step 3: Push
```bash
git push -u origin main
```

---

## Authentication Issues

### If GitHub asks for credentials:

**Option 1: Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo`
4. Copy the token
5. Use token as password when pushing

**Option 2: GitHub CLI**
```bash
# Install GitHub CLI
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: See https://cli.github.com/

# Login
gh auth login

# Then push normally
git push origin main
```

**Option 3: SSH Keys**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Use SSH URL for remote: `git@github.com:USERNAME/REPO.git`

---

## Troubleshooting

### Error: "fatal: not a git repository"
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"
```

### Error: "remote origin already exists"
```bash
# Check current remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Error: "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Check Your Branch Name
```bash
# See current branch
git branch

# If on 'master', either:
# Option 1: Push to master
git push origin master

# Option 2: Rename to main
git branch -M main
git push origin main
```

---

## After Pushing Successfully

✅ Your code is now on GitHub!

**Next Steps:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables
4. Deploy!

See `QUICK_DEPLOY.md` for deployment instructions.

