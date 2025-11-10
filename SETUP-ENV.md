# How to Set Up Your .env File

## Step 1: Open Your .env File

1. Go to the `backend` folder
2. Open the `.env` file (or create it if it doesn't exist)

## Step 2: Get Your Supabase Credentials

### From Your Supabase Dashboard:

1. **Project URL** (from API Settings page):
   - Go to: Settings → Data API (or API Settings)
   - Copy the **Project URL**: `https://niikfliudusrysmaiqyc.supabase.co`
   - This is your `SUPABASE_URL`

2. **Service Role Key** (from API Keys page):
   - Go to: Settings → API Keys
   - Find the **"service_role secret"** key
   - Click the **Copy** button next to it
   - This is your `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **WARNING**: This is a SECRET key - never share it!

3. **JWT Secret** (from JWT Keys page):
   - Go to: Settings → JWT Keys
   - Find the **"Legacy JWT secret"** field
   - Click the **Copy** button
   - This is your `JWT_SECRET`

## Step 3: Update Your .env File

Replace the values in your `.env` file:

```env
SUPABASE_URL=https://niikfliudusrysmaiqyc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
JWT_SECRET=paste_your_jwt_secret_here
PORT=3000
```

## Step 4: Save and Restart Server

1. Save the `.env` file
2. Restart your backend server
3. The server should now connect to Supabase!

## Verification

After starting the server, you should see:
```
✅ Supabase connected successfully
🚀 Server running on http://localhost:3000
```

If you see errors, check:
- All three values are filled in correctly
- No extra spaces or quotes around the values
- The Supabase project is active

