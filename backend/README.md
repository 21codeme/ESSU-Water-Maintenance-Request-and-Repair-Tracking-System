# ESSU Water Maintenance - Backend API

Backend API server for the ESSU Water Maintenance Portal.

## Setup Instructions

### 1. Supabase Database Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql` file
4. Click **Run** to create the database tables and schema

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

1. Create a `.env` file in the backend directory
2. Add your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

**How to get Supabase credentials:**
- Go to your Supabase project dashboard
- Click on **Settings** → **API**
- Copy the **Project URL** (SUPABASE_URL)
- Copy the **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

### 4. Set Up Demo Users

After configuring Supabase, run the setup script to create demo users:

```bash
npm run setup
```

This will create demo users with proper password hashes:
- Admin: `admin@essu.edu` / `admin123`
- Technician: `tech@essu.edu` / `tech123`
- User: `user@essu.edu` / `user123`

### 5. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user

### Reports
- `GET /api/reports` - Get all reports (authenticated)
- `GET /api/reports/public` - Get public reports (no auth)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report (with image upload)
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user

### Health Check
- `GET /api/health` - Check API status

## Notes

- The `uploads` folder will be created automatically for storing images
- JWT tokens expire after 24 hours

