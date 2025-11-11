# 🚀 Quick Deploy to Vercel - 5 Minutes Guide

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] Supabase project with Storage bucket created
- [ ] All code committed to Git

---

## Step 1: Setup Supabase Storage (2 minutes)

1. Go to https://supabase.com → Your Project
2. Click **Storage** (left sidebar)
3. Click **New bucket**
4. Name: `uploads`
5. ✅ Check **Public bucket**
6. Click **Create bucket**

**Done!** ✅

---

## Step 2: Get Your Credentials (1 minute)

### From Supabase:
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (SUPABASE_URL)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### Generate JWT Secret:
```bash
# On Windows PowerShell:
-([System.Guid]::NewGuid().ToString())

# On Mac/Linux:
openssl rand -hex 32
```

Or just use any random string like: `my-secret-jwt-key-12345`

---

## Step 3: Deploy to Vercel (2 minutes)

### Via Web Dashboard (Easiest):

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Click**: "Add New Project"
4. **Import** your repository
5. **Configure**:
   - Framework: **Other**
   - Root Directory: **./** (default)
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. **Click**: "Environment Variables"
7. **Add these 4 variables**:
   ```
   SUPABASE_URL = [paste your Supabase URL]
   SUPABASE_SERVICE_ROLE_KEY = [paste your service role key]
   JWT_SECRET = [your random secret]
   NODE_ENV = production
   ```
8. **Click**: "Deploy"

**Wait 2-3 minutes...** ⏳

---

## Step 4: Test (30 seconds)

1. After deployment, click on your project
2. Copy the deployment URL (e.g., `https://your-project.vercel.app`)
3. Test: `https://your-project.vercel.app/api/health`
4. Should see: `{"status":"ok",...}`

**Success!** 🎉

---

## Troubleshooting

### Build Failed?
- Check that all dependencies are in root `package.json`
- Check Vercel build logs for errors

### API Not Working?
- Verify environment variables are set correctly
- Check that Supabase Storage bucket exists
- Review Vercel function logs

### Images Not Uploading?
- Make sure Supabase Storage bucket is **Public**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Vercel function logs for upload errors

---

## Need More Help?

See detailed guide: `VERCEL_DEPLOYMENT_FIXED.md`

