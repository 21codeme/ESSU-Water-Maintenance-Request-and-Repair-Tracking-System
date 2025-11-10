# ESSU Water Maintenance Request and Repair Tracking System

A comprehensive web-based system for managing water maintenance requests and repair tracking for Eastern Samar State University (ESSU).

## Features

- **User Management**: Role-based access control (Admin, Technician, User)
- **Report Management**: Create, view, and track maintenance requests
- **Status Tracking**: Real-time status updates (Pending, In Progress, Resolved, Cancelled)
- **Priority System**: Urgent, High, Medium, Low priority levels
- **File Uploads**: Support for completion proof images
- **Admin Dashboard**: Comprehensive admin interface with statistics and reports
- **Technician Dashboard**: Assignment management and status updates
- **Public Reports**: View reports without login requirement

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Modern UI with gradient designs and animations
- Responsive design

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL database)
- JWT Authentication
- bcrypt for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/21codeme/ESSU-Water-Maintenance-Request-and-Repair-Tracking-System.git
cd ESSU-Water-Maintenance-Request-and-Repair-Tracking-System
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Configure environment variables:
Create a `.env` file in the `backend` directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

4. Set up the database:
- Run the SQL schema from `backend/supabase-schema.sql` in your Supabase SQL editor
- Run migration scripts if needed:
  - `backend/add-confirmation-columns.sql`
  - `backend/add-completion-proof-column.sql`

5. Start the backend server:
```bash
npm start
# or for development
npm run dev
```

6. Open the frontend:
- Use a local server (e.g., Live Server extension in VS Code)
- Navigate to `frontend/index.html` in your browser

## Project Structure

```
ESSU-Water-Maintenance-Request-and-Repair-Tracking-System/
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── email.js
│   │   ├── reports.js
│   │   └── users.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── admin/
│   ├── dashboard/
│   ├── login/
│   ├── myreports/
│   ├── report/
│   ├── images/
│   └── index.html
└── README.md
```

## Usage

### Admin
- Login with admin credentials
- View all reports and manage assignments
- Track statistics and completed reports
- Manage users

### Technician
- Login with technician credentials
- View assigned reports
- Update report status
- Upload completion proof
- Confirm reports to admin

### User
- Create maintenance requests
- View own reports
- Track request status

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Reports
- `GET /api/reports` - Get all reports (authenticated)
- `GET /api/reports/public` - Get all reports (public)
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

21codeme

## Acknowledgments

- Eastern Samar State University (ESSU)
- Supabase for database hosting
- All contributors and testers

