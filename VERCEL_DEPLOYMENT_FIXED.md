# Vercel Deployment Guide - Updated for Supabase Storage

## ✅ Mga Fix na Ginawa

1. **File Uploads**: In-update para gumamit ng Supabase Storage instead of local filesystem
2. **Multer Configuration**: Changed from disk storage to memory storage (compatible with Vercel serverless)
3. **Image URLs**: Files are now stored in Supabase Storage and return full public URLs

## Prerequisites

1. GitHub account with the repository pushed
2. Vercel account (sign up at https://vercel.com)
3. Supabase project with Storage bucket created

## Step 1: Setup Supabase Storage

### Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Create a bucket named: `uploads`
5. Make it **Public** (so images can be accessed via URL)
6. Click **Create bucket**

### Set Bucket Policies (Optional but Recommended)

Go to **Storage** → **Policies** → `uploads` bucket:

**For Upload Policy:**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');
```

**For Public Read Policy:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');
```

## Step 2: Deploy to Vercel

### 1. Connect to Vercel

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click **Add New Project**
4. Import your repository

### 2. Configure Project Settings

#### Framework Preset
- Select: **Other**

#### Root Directory
- Leave as default (root)

#### Build Command
- Leave empty or use: `npm run vercel-build`

#### Output Directory
- Leave empty (Vercel will handle routing)

### 3. Environment Variables

**CRITICAL**: Add these environment variables in Vercel dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

**How to get Supabase credentials:**
- Go to your Supabase project dashboard
- Click on **Settings** → **API**
- Copy the **Project URL** (SUPABASE_URL)
- Copy the **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

**Important**: 
- Select **all environments** (Production, Preview, Development)
- Make sure there are no spaces or extra characters

### 4. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

## Step 3: Update Frontend API URLs

The frontend will automatically detect the API URL based on the current origin. If you need to override:

1. Go to `frontend/admin/config.js` or `frontend/config.js`
2. Set `window.API_URL` before the app loads:

```javascript
window.API_URL = 'https://your-project-name.vercel.app/api';
```

Or add this in your HTML files before loading app.js:

```html
<script>
  window.API_URL = 'https://your-project-name.vercel.app/api';
</script>
```

## Step 4: Test Deployment

1. **Test API Health**: 
   - Visit: `https://your-project-name.vercel.app/api/health`
   - Should return: `{"status":"ok",...}`

2. **Test File Upload**:
   - Create a new report with an image
   - Check if image is uploaded to Supabase Storage
   - Verify image URL is accessible

3. **Test Authentication**:
   - Try logging in
   - Verify JWT tokens are working

## Troubleshooting

### Build Errors

**Error: Cannot find module**
- Make sure all dependencies are in root `package.json`
- Check that `backend/package.json` dependencies are also in root `package.json`

**Error: Module not found**
- Run `npm install` in root directory
- Commit `package-lock.json` to git

### Runtime Errors

**Error: Supabase Storage bucket not found**
- Make sure you created the `uploads` bucket in Supabase
- Verify bucket is set to **Public**

**Error: 413 Payload Too Large**
- Vercel has a 4.5MB limit for serverless functions
- Our limit is set to 3MB in multer config
- If needed, increase timeout in `vercel.json`

**Error: Function timeout**
- Default timeout is 10 seconds
- Updated to 30 seconds in `vercel.json`
- For longer operations, consider using Vercel Pro

### API Not Working

**404 on API routes**
- Check `vercel.json` routing configuration
- Verify `api/index.js` exists and exports Express app

**CORS errors**
- CORS is enabled in `api/index.js`
- If issues persist, check Vercel function logs

### Image Upload Issues

**Images not uploading**
- Check Supabase Storage bucket exists
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check Vercel function logs for errors

**Images not displaying**
- Verify bucket is **Public**
- Check image URLs in database (should be Supabase Storage URLs)
- Test image URL directly in browser

## Project Structure for Vercel

```
/
├── api/
│   └── index.js          # Serverless function entry point
├── backend/
│   ├── routes/           # API routes
│   ├── config/           # Configuration files
│   ├── utils/
│   │   └── storage.js    # Supabase Storage utilities
│   └── ...
├── frontend/
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # Technician dashboard
│   ├── login/            # Login page
│   └── ...
├── vercel.json           # Vercel configuration
└── package.json          # Root package.json (must include all dependencies)
```

## Important Notes

1. **File Uploads**: Files are now stored in Supabase Storage, not local filesystem
2. **Environment Variables**: Never commit `.env` files. Always use Vercel's environment variables
3. **API Routes**: All API routes are accessible at `/api/*`
4. **Frontend Routes**: Frontend pages are served from `/frontend/*` paths
5. **Image URLs**: Images are served directly from Supabase Storage (public URLs)

## Migration from Local to Supabase Storage

If you have existing reports with local file paths (`/uploads/...`):

1. The old paths will still work if you're running locally
2. For Vercel deployment, you need to migrate existing images:
   - Download images from local `backend/uploads/` folder
   - Upload them to Supabase Storage bucket `uploads`
   - Update database `image_path` and `completion_proof_path` columns with new Supabase Storage URLs

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- Project README: README.md

