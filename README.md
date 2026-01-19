# Attendance & Leave Management System

A comprehensive web-based attendance and leave management system built using the MERN stack. This system enables teachers to mark student attendance and manage leave requests efficiently, while students can view their attendance records and apply for leaves.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Workflow](#workflow)
- [Project Structure](#project-structure)

## Features

### Teacher Dashboard

- **Mark Attendance**: Bulk attendance marking for multiple students
- **View Attendance Records**: Complete attendance history with filters
- **Manage Leave Requests**: Approve or reject student leave applications
- **Department-wise Management**: Automatic filtering based on teacher's department
- **Real-time Statistics**: Dashboard showing today's attendance and pending leaves
- **Profile Management**: Update personal information and settings

### Student Dashboard

- **View Attendance**: Personal attendance records with statistics
- **Apply for Leave**: Submit leave requests with reasons
- **Track Leave Status**: Monitor leave application status (pending/approved/rejected)
- **Attendance Calendar**: Visual representation of attendance history
- **Performance Metrics**: Attendance percentage and monthly statistics

### Authentication & Authorization

- Role-based access control (Teacher/Student)
- Secure JWT-based authentication
- Teacher ID validation system
- Password encryption using bcrypt

## Tech Stack

### Frontend

- **React.js** (v18.2.0) - UI library
- **React Router** (v6.x) - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling

### Backend

- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** (v8.0.0) - MongoDB ODM

### Security

- **JWT** (v9.0.2) - Authentication
- **bcryptjs** (v2.4.3) - Password hashing
- **CORS** (v2.8.5) - Cross-origin requests

### Development Tools

- **Nodemon** (v3.0.1) - Auto-restart server
- **Concurrently** (v8.2.2) - Run multiple commands
- **dotenv** (v16.3.1) - Environment variables

## System Architecture

```
Client (React App)
    |
    | HTTP/HTTPS (REST API)
    |
Express.js Server
    |
    | Mongoose ODM
    |
MongoDB Database
```

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Step 1: Clone Repository

```bash
git clone https://github.com/Himanshuyadav6764/attendance_system.git
cd attendance_system
```

### Step 2: Install Dependencies

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Step 3: Environment Configuration

Create `.env` file in root:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### Step 4: Create Teacher ID

```bash
node createHodId.js
```

### Step 5: Start Application

```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd client
npm start
```

Application URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Configuration

### Database

MongoDB Atlas (default) or local MongoDB:

```env
MONGO_URI=mongodb://localhost:27017/attendance-db
```

### JWT Settings

- Token expiration: 7 days
- Secure cookies for production

### CORS

Configure in `server.js`:

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

## Usage

### Teacher Login

- URL: http://localhost:3000/login
- Teacher ID: `TEACHER_IT_001`
- Password: `admin123`

### Mark Attendance

1. Click "Mark Attendance"
2. Select date
3. Check students
4. Choose status (Present/Absent/Late)
5. Click "Mark Attendance"

### Student Registration

1. Navigate to register page
2. Fill details (name, email, roll number, department)
3. Submit registration
4. Login with credentials

## API Documentation

### Authentication

#### POST /api/auth/register

Register new user

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "rollNumber": "CS2021001",
  "department": "Computer Science"
}
```

#### POST /api/auth/login

User login

**Request:**

```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Attendance

#### POST /api/attendance/bulk (Teacher)

Mark bulk attendance

**Request:**

```json
{
  "attendance": [
    {
      "studentId": "user_id",
      "status": "present",
      "date": "2026-01-19"
    }
  ]
}
```

#### GET /api/attendance (Student)

Get personal attendance

**Query Parameters:**

- startDate: Filter start date
- endDate: Filter end date
- limit: Number of records (default: 30)

#### GET /api/attendance/students (Teacher)

Get students list

### Leave Management

#### POST /api/leaves (Student)

Submit leave application

**Request:**

```json
{
  "startDate": "2026-01-20",
  "endDate": "2026-01-22",
  "reason": "Medical emergency",
  "leaveType": "medical"
}
```

#### PUT /api/leaves/:id (Teacher)

Update leave status

**Request:**

```json
{
  "status": "approved",
  "remarks": "Approved"
}
```

## Database Schema

### User

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'teacher']),
  rollNumber: String (student only),
  teacherId: String (teacher only),
  department: String (required)
}
```

### Attendance

```javascript
{
  user: ObjectId (ref: 'User'),
  date: Date (required),
  status: String (enum: ['present', 'absent', 'late']),
  checkInTime: Date,
  markedBy: ObjectId (ref: 'User')
}
```

### Leave

```javascript
{
  user: ObjectId (ref: 'User'),
  startDate: Date (required),
  endDate: Date (required),
  reason: String (required),
  leaveType: String (enum: ['medical', 'personal', 'other']),
  status: String (enum: ['pending', 'approved', 'rejected']),
  approvedBy: ObjectId (ref: 'User')
}
```

## Workflow

### Attendance Marking Flow

```
Teacher Login
    ↓
Dashboard → Mark Attendance
    ↓
Select Students & Status
    ↓
Submit Attendance
    ↓
Database Updated
    ↓
Student Dashboard Reflects Changes
```

### Leave Application Flow

```
Student Login
    ↓
Apply for Leave
    ↓
Submit Application (Status: Pending)
    ↓
Teacher Reviews
    ↓
Approve/Reject
    ↓
Student Receives Update
```

## Project Structure

```
attendance_system/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React context
│   └── package.json
├── controllers/          # Business logic
├── models/               # Database models
├── routes/               # API routes
├── middleware/           # Custom middleware
├── .env                  # Environment variables
├── server.js             # Express server
└── README.md
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication (7-day expiration)
- Role-based access control
- Input validation
- MongoDB injection prevention

## Deployment

### Heroku

```bash
heroku create app-name
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Environment Variables

```env
NODE_ENV=production
MONGO_URI=production_mongodb_uri
JWT_SECRET=secure_jwt_secret
PORT=5000
```

## Troubleshooting

### Port in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### MongoDB Connection Error

- Check MongoDB URI
- Verify network access
- Check IP whitelist

## Future Enhancements

- Email notifications
- Export to Excel/PDF
- Mobile app
- Biometric attendance
- Analytics dashboard

## License

ISC License

## Contact

- GitHub: [@Himanshuyadav6764](https://github.com/Himanshuyadav6764)
- Repository: https://github.com/Himanshuyadav6764/attendance_system

---

**Note**: Educational project. Additional security measures recommended for production.
