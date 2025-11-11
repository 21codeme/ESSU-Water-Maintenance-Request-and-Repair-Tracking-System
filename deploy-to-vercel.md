# Quick Deploy to Vercel - Step by Step

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Prepare Your Code
1. Make sure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Updated for Vercel deployment with Supabase Storage"
   git push origin main
   ```

### Step 2: Setup Supabase Storage
1. Go to https://supabase.com and login
2. Open your project
3. Go to **Storage** (left sidebar)
4. Click **New bucket**
5. Name: `uploads`
6. Check **Public bucket**
7. Click **Create bucket**

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Sign in (use GitHub account)
3. Click **Add New Project**
4. Import your repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
6. Click **Environment Variables** and add:
   ```
   SUPABASE_URL = your_supabase_url_here
   SUPABASE_SERVICE_ROLE_KEY = your_service_role_key_here
   JWT_SECRET = your_jwt_secret_here
   NODE_ENV = production
   ```
7. Click **Deploy**

### Step 4: Test
1. Wait for deployment to complete
2. Visit: `https://your-project.vercel.app/api/health`
3. Should see: `{"status":"ok",...}`

---

## Option 2: Deploy via Vercel CLI (Advanced)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? (press Enter for default)
- Directory? (press Enter for current directory)
- Override settings? **No**

### Set Environment Variables
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

For each, enter the value when prompted.

### Deploy to Production
```bash
vercel --prod
```

---

## Quick Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed to GitHub
- [ ] Supabase Storage bucket `uploads` is created and set to Public
- [ ] You have your Supabase URL and Service Role Key
- [ ] You have a JWT_SECRET (can be any random string)
- [ ] Vercel account is connected to GitHub

---

## Need Help?

If you encounter errors:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Make sure Supabase Storage bucket exists
4. Check that all dependencies are in `package.json`

