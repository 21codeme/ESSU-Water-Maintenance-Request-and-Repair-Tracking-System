# Vercel Deployment Guide

## Prerequisites
1. GitHub account with the repository pushed
2. Vercel account (sign up at https://vercel.com)

## Deployment Steps

### 1. Connect to Vercel
1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your repository: `21codeme/ESSU-Water-Maintenance-Request-and-Repair-Tracking-System`

### 2. Configure Project Settings

#### Framework Preset
- Select: **Other** or **Node.js**

#### Root Directory
- Leave as default (root)

#### Build Command
- Leave empty or use: `npm run vercel-build`

#### Output Directory
- Leave empty (Vercel will handle routing)

### 3. Environment Variables

Add these environment variables in Vercel dashboard:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

**How to add:**
1. In project settings, go to "Environment Variables"
2. Add each variable with its value
3. Make sure to select all environments (Production, Preview, Development)

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

### 5. Update Frontend API URLs

After deployment, update the frontend API URLs:

1. Go to `frontend/config.js` files
2. Update `API_BASE_URL` to your Vercel deployment URL:
   ```javascript
   const API_BASE_URL = 'https://your-project-name.vercel.app';
   ```

Or use environment variables in Vercel to set the API URL dynamically.

### 6. Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Project Structure for Vercel

```
/
├── api/
│   └── index.js          # Serverless function entry point
├── backend/
│   ├── routes/           # API routes
│   ├── config/           # Configuration files
│   └── ...
├── frontend/
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # Technician dashboard
│   ├── login/            # Login page
│   └── ...
├── vercel.json           # Vercel configuration
└── package.json          # Root package.json
```

## Important Notes

1. **File Uploads**: Uploaded files are stored in `backend/uploads/`. For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

2. **Environment Variables**: Never commit `.env` files. Always use Vercel's environment variables.

3. **API Routes**: All API routes are accessible at `/api/*`

4. **Frontend Routes**: Frontend pages are served from `/frontend/*` paths

5. **Static Files**: Images and assets are served from `/frontend/images/*`

## Troubleshooting

### 404 Errors
- Check `vercel.json` routing configuration
- Ensure all paths are correctly mapped

### API Not Working
- Verify environment variables are set in Vercel
- Check API routes in `api/index.js`
- Review Vercel function logs

### Build Errors
- Check Node.js version (should be >=14)
- Verify all dependencies are in `package.json`
- Review build logs in Vercel dashboard

## Support

For issues, check:
- Vercel Documentation: https://vercel.com/docs
- Project README: README.md
- GitHub Issues: https://github.com/21codeme/ESSU-Water-Maintenance-Request-and-Repair-Tracking-System/issues

