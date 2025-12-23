# Attendance & Leave Management System 🎓

A modern, production-ready attendance and leave management system built with the MERN stack (MongoDB, Express, React, Node.js). Features a clean, Google Gemini-inspired UI with comprehensive role-based access control for Students, HODs (Head of Department), and Admins.

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Roles & Permissions](#-roles--permissions)
- [API Endpoints](#-api-endpoints)
- [Authentication & Authorization Flow](#-authentication--authorization-flow)
- [Setup Instructions](#-setup-instructions)
- [API Testing with Postman](#-api-testing-with-postman)
- [UI/UX Design](#-uiux-design)
- [Configuration](#-configuration)
- [Business Logic](#-business-logic)
- [Development](#-development)
- [Dependencies](#-dependencies)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [License](#-license)

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd major_project

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Set up environment variables
# Create .env file in root directory with:
# MONGO_URI=mongodb://localhost:27017/attendance-leave-db
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:3000

# Run both servers concurrently
npm run dev:full

# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:3000
```

## ✨ Features

### Student Features

- 📝 **Mark Daily Attendance** - One-time attendance marking per day with remarks
- 📊 **View Attendance History** - Track personal attendance records with detailed statistics
- 🏖️ **Apply for Leave** - Submit leave applications with date range and detailed reasons
- 📋 **Track Leave Status** - Monitor pending, approved, and rejected leaves in real-time
- ❌ **Delete Pending Leaves** - Cancel pending leave applications before review
- 📅 **Attendance Calendar** - Visual calendar view of attendance records

### HOD (Head of Department) Features

- 👨‍💼 **Profile Management** - Update personal information and department details
- 🔐 **Password Management** - Secure password update functionality
- 👥 **Manage HOD Accounts** - Create, update, and delete HOD accounts
- 📊 **Department Dashboard** - View department-specific attendance and leave analytics
- ✅ **Leave Approval** - Approve or reject student leave applications with remarks
- 📈 **Attendance Monitoring** - Monitor attendance records for students in their department

### Admin Features

- 🔍 **View All Attendance** - Monitor attendance records for all students across departments
- 🎯 **Advanced Filtering** - Filter by date range, status, student, and department
- 📊 **Real-time Statistics** - Comprehensive dashboard with attendance analytics
- 📝 **Manage Leave Requests** - Review, approve or reject all student leave applications
- 💬 **Add Admin Remarks** - Provide detailed feedback on leave decisions
- 🔒 **Role-based Access** - Complete control over system management
- 👥 **User Management** - Manage all user accounts and roles

## Architecture

### Tech Stack

**Frontend**

- React 18 - Modern UI library with hooks
- React Router v6 - Client-side routing
- Axios - Promise-based HTTP client
- CSS3 - Custom styling with modern features

**Backend**

- Node.js - JavaScript runtime
- Express.js 4 - Web application framework
- JWT - Stateless authentication
- Bcrypt.js - Password hashing

**Database**

- MongoDB - NoSQL document database
- Mongoose ODM - Object data modeling

**Development Tools**

- Nodemon - Auto-restart development server
- Concurrently - Run multiple commands simultaneously
- Postman - API testing and documentation

**Deployment**

- Vercel - Serverless deployment platform

### Project Structure

```
major_project/
├── server.js                 # Express server entry point
├── package.json             # Backend dependencies and scripts
├── vercel.json              # Vercel deployment configuration
├── Postman_Collection.json  # API testing collection
├── models/                  # MongoDB schemas
│   ├── User.js              # User model with authentication
│   ├── Attendance.js        # Attendance records
│   ├── Leave.js             # Leave applications
│   └── HodId.js             # HOD identification model
├── controllers/             # Business logic
│   ├── authController.js    # Authentication handlers
│   ├── attendanceController.js # Attendance logic
│   ├── leaveController.js   # Leave management
│   └── hodController.js     # HOD management
├── routes/                  # API route definitions
│   ├── authRoutes.js
│   ├── attendanceRoutes.js
│   ├── leaveRoutes.js
│   └── hodRoutes.js
├── middleware/              # Custom middleware
│   └── auth.js             # JWT verification & authorization
└── client/                  # React frontend
    ├── package.json         # Frontend dependencies
    ├── public/              # Static files
    ├── build/               # Production build
    └── src/
        ├── App.js           # Main app component
        ├── components/      # Reusable components
        │   ├── Navbar.js
        │   └── PrivateRoute.js
        ├── context/        # React context
        │   └── AuthContext.js
        ├── pages/          # Page components
        │   ├── Dashboard.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── StudentAttendance.js
        │   ├── StudentLeaves.js
        │   ├── AdminAttendance.js
        │   ├── AdminLeaves.js
        │   ├── AttendanceCalendar.js
        │   └── HodProfile.js
        └── services/       # API service layer
            ├── api.js
            ├── authService.js
            ├── attendanceService.js
            └── leaveService.js
```

## Roles & Permissions

### Student Role

- ✅ Can mark own attendance (once per day)
- ✅ Can view only their attendance records
- ✅ Can apply for leaves with date ranges
- ✅ Can view and delete own pending leaves
- ❌ Cannot access admin or HOD routes
- ❌ Cannot view other students' records

### HOD (Head of Department) Role

- ✅ Can manage profile and update password
- ✅ Can view all students' attendance records in their department
- ✅ Can view all leave applications from their department
- ✅ Can approve or reject leave requests with remarks
- ✅ Can create, update, and delete HOD accounts
- ✅ Can reset HOD passwords
- ✅ Access to HOD-specific dashboard and analytics
- ❌ Cannot access admin-only features
- ❌ Limited to department-level management

### Admin Role

- ✅ Can view all students' attendance records across all departments
- ✅ Can filter and search attendance data with advanced options
- ✅ Can view all leave applications system-wide
- ✅ Can approve/reject leave requests with detailed remarks
- ✅ Can add remarks to leave decisions
- ✅ Full system access across all departments
- ✅ Can manage all user accounts
- ✅ Access to comprehensive analytics and reports

## API Endpoints

### Authentication

```
POST   /api/auth/register    - Register new user (student/HOD/admin)
POST   /api/auth/login       - Login user with credentials
GET    /api/auth/me          - Get current user profile
PUT    /api/auth/profile     - Update user profile
PUT    /api/auth/password    - Change user password
```

### Attendance (Student)

```
POST   /api/attendance       - Mark attendance (once per day)
GET    /api/attendance       - Get own attendance records
```

### Attendance (Admin/HOD)

```
GET    /api/attendance/all   - Get all attendance records (filtered by role)
GET    /api/attendance/stats - Get attendance statistics and analytics
```

### Leave (Student)

```
POST   /api/leave            - Apply for leave with date range
GET    /api/leave            - Get own leave applications
DELETE /api/leave/:id        - Delete pending leave application
```

### Leave (Admin/HOD)

```
GET    /api/leave/all        - Get all leave applications (filtered by department for HOD)
PATCH  /api/leave/:id        - Approve/reject leave with remarks
```

### HOD Management

```
POST   /api/hod              - Create new HOD account (HOD only)
GET    /api/hod              - Get all HOD accounts
PUT    /api/hod/:id          - Update HOD account details
DELETE /api/hod/:id          - Delete HOD account
PUT    /api/hod/:id/reset-password - Reset HOD password
```

## Authentication & Authorization Flow

### Registration Flow

1. User submits registration form
2. Server validates input data
3. Password is hashed using bcrypt (10 salt rounds)
4. User document created in MongoDB
5. JWT token generated and returned
6. Token stored in localStorage
7. User redirected to dashboard

### Login Flow

1. User submits credentials
2. Server validates email and password
3. Password compared using bcrypt
4. JWT token generated (7-day expiry)
5. Token sent to client
6. Token stored in localStorage
7. User redirected based on role

### Authorization Middleware

1. **authenticate**: Verifies JWT token from Authorization header
2. **authorize**: Checks user role matches required role
3. **verifyOwnership**: Ensures users can only access their own data

### Security Features

- ✅ **Password Hashing**: Bcrypt with 10 salt rounds
- ✅ **JWT Authentication**: Stateless token-based auth with 7-day expiry
- ✅ **Role-Based Access Control (RBAC)**: Three-tier role system
- ✅ **Ownership Verification**: Users can only access their own data
- ✅ **Protected Routes**: Both backend API and frontend routes
- ✅ **Input Validation**: Using express-validator
- ✅ **CORS Configuration**: Controlled cross-origin requests
- ✅ **Secure Headers**: Protection against common vulnerabilities
- ✅ **Password Requirements**: Minimum length and complexity
- ✅ **Token Expiration**: Automatic session timeout
- ✅ **Selective Field Return**: Passwords never returned in API responses

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone and Navigate**

   ```bash
   cd c:\major_project
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/attendance-leave-db
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**

   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas (update MONGO_URI in .env)
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

### Frontend Setup

1. **Navigate to Client**

   ```bash
   cd client
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start React App**
   ```bash
   npm start
   ```
   App runs on http://localhost:3000

### Running Both Servers Concurrently

From the root directory:

```bash
npm run dev:full
```

## API Testing with Postman

### Import Collection

1. Import `Postman_Collection.json` into Postman
2. Set up environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (automatically set after login)

### Testing Flow

1. **Register a Student**

   ```json
   POST /api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "student",
     "rollNumber": "CS2024001",
     "department": "Computer Science"
   }
   ```

2. **Register an HOD**

   ```json
   POST /api/auth/register
   {
     "name": "Dr. John Smith",
     "email": "hod@example.com",
     "password": "hod123",
     "role": "hod",
     "department": "Computer Science"
   }
   ```

3. **Register an Admin**

   ```json
   POST /api/auth/register
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "admin123",
     "role": "admin"
   }
   ```

4. **Login**

   ```json
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

5. **Mark Attendance (Student)**

   ```json
   POST /api/attendance
   Headers: Authorization: Bearer <token>
   {
     "status": "present",
     "remarks": "On time"
   }
   ```

6. **Apply Leave (Student)**

   ```json
   POST /api/leave
   Headers: Authorization: Bearer <token>
   {
     "startDate": "2024-01-15",
     "endDate": "2024-01-17",
     "reason": "Family function"
   }
   ```

7. **Approve Leave (Admin/HOD)**

   ```json
   PATCH /api/leave/:leaveId
   Headers: Authorization: Bearer <admin_or_hod_token>
   {
     "status": "approved",
     "adminRemarks": "Approved for family reasons"
   }
   ```

8. **Create HOD Account (HOD only)**
   ```json
   POST /api/hod
   Headers: Authorization: Bearer <hod_token>
   {
     "name": "Dr. Jane Doe",
     "email": "jane.hod@example.com",
     "password": "securepass123",
     "department": "Information Technology"
   }
   ```

## UI/UX Design

### Design Philosophy

- **Modern & Clean**: Inspired by Google Gemini's interface
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: High contrast, readable fonts, clear navigation
- **Intuitive**: Self-explanatory interfaces with visual feedback

### Color Palette

- Primary: `#1a73e8` (Google Blue)
- Success: `#34a853` (Green)
- Warning: `#fbbc04` (Yellow)
- Error: `#ea4335` (Red)
- Neutrals: Gray scale from `#202124` to `#f8f9fa`

### Key Components

- **Cards**: Elevated surfaces with shadow effects
- **Buttons**: Rounded, with hover states and loading indicators
- **Badges**: Status indicators with contextual colors
- **Forms**: Clean inputs with focus states
- **Tables**: Responsive with hover effects
- **Alerts**: Contextual notifications with icons

## Configuration

### MongoDB Indexes

- User email: Unique index
- User rollNumber: Unique sparse index
- Attendance (user + date): Compound unique index

### JWT Configuration

- Secret: Defined in .env
- Expiry: 7 days (configurable)
- Algorithm: HS256

### CORS Settings

- Origin: CLIENT_URL from .env
- Credentials: true

## Evaluation Criteria

### Security

- Bcrypt password hashing with 10 salt rounds
- JWT-based authentication
- Role-based authorization middleware
- Ownership verification for data access
- Input validation and sanitization
- Protected routes and endpoints

### API Correctness

- RESTful design principles
- Proper HTTP methods and status codes
- Comprehensive error handling
- Consistent response formats
- Request validation

### Code Readability

- Clear variable and function names
- Comprehensive comments
- Modular structure
- Separation of concerns
- DRY principles

### Role Enforcement

- Middleware-based role checking
- Route-level protection
- UI-based role rendering
- Separate admin/student routes

### Ownership-Based Access

- Students see only their data
- Middleware verification
- Database-level filtering
- Frontend route protection

## Business Logic

### Attendance Rules

1. Students can mark attendance once per day
2. Attendance date set to midnight for consistency
3. Unique index prevents duplicate entries
4. Check-in time recorded automatically
5. Students can only view own records
6. Admins have full visibility

### Leave Management Rules

1. Leave start date cannot be in the past
2. End date must be start date
3. Reason must be 10 characters
4. Status workflow: pending approved/rejected
5. Only pending leaves can be deleted
6. Only admins can change status
7. Admin remarks optional but recommended

## Development

### Available Scripts

Backend:

```bash
npm start            # Production server
npm run dev          # Development with nodemon
npm run seed:hod     # Seed single HOD account
npm run seed:multiple-hods # Seed multiple HOD accounts
```

Frontend:

```bash
npm start        # Development server (http://localhost:3000)
npm run build    # Production build
npm test         # Run tests
```

Both:

```bash
npm run dev:full # Run both backend and frontend servers concurrently
npm run client   # Start frontend only
```

## Dependencies

### Backend

- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: CORS middleware
- dotenv: Environment variables
- express-validator: Input validation

### Frontend

- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- jwt-decode: JWT decoding

## Troubleshooting

### MongoDB Connection Error

```
Error: MongoServerError: Authentication failed
```

**Solution**: Check MONGO_URI in .env, ensure MongoDB is running

### JWT Token Error

```
Error: jwt malformed
```

**Solution**: Clear localStorage and login again

### CORS Error

```
Access to XMLHttpRequest blocked by CORS
```

**Solution**: Verify CLIENT_URL in backend .env matches frontend URL

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Kill process on port 5000 or change PORT in .env

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel with `vercel.json`:

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Build Frontend**

   ```bash
   cd client
   npm run build
   cd ..
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

```env
MONGO_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_production_jwt_secret>
JWT_EXPIRE=7d
CLIENT_URL=<your_vercel_frontend_url>
NODE_ENV=production
```

## License

ISC

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👥 Authors

- **Your Name** - Initial work

---

**Built with ❤️ using MERN Stack**

---

## 📝 Additional Notes

- Ensure MongoDB is running before starting the backend server
- Keep your JWT_SECRET secure in production
- Use HTTPS in production environments
- Regular backups of MongoDB data recommended
- Monitor application logs for security issues
- Update dependencies regularly for security patches
