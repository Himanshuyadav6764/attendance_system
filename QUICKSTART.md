#  Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Backend Dependencies

```bash
cd c:\major_project
npm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
copy .env.example .env

# Edit .env and update these values:
# - MONGO_URI (your MongoDB connection string)
# - JWT_SECRET (a random secret key)
```

### Step 3: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or configure MongoDB Atlas URI in .env
```

### Step 4: Start Backend Server

```bash
npm run dev
```

 Backend running on http://localhost:5000

### Step 5: Install Frontend Dependencies

```bash
# Open new terminal
cd c:\major_project\client
npm install
```

### Step 6: Start Frontend

```bash
npm start
```

 Frontend running on http://localhost:3000

##  Test the Application

### Create Admin Account

1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: Admin
3. Click "Create Account"

### Create Student Account

1. Logout and go to /register again
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: student123
   - Role: Student
   - Roll Number: CS2024001
   - Department: Computer Science
3. Click "Create Account"

### Test Student Features

1. Login as student
2. Mark attendance from dashboard
3. Apply for leave
4. View attendance history

### Test Admin Features

1. Login as admin
2. View all attendance records
3. Review leave applications
4. Approve/reject leaves

##  Test with Postman

1. Import `Postman_Collection.json` into Postman
2. Set base_url variable: `http://localhost:5000/api`
3. Run the requests in order:
   - Register  Login  Mark Attendance  Apply Leave

##  Quick Commands

### Run Both Servers Together

```bash
# From root directory
npm run dev:full
```

### Reset Database (if needed)

```bash
# Connect to MongoDB and drop database
mongosh
use attendance-leave-db
db.dropDatabase()
```

##  Common Issues

### Port 5000 Already in Use

```bash
# Change PORT in .env file
PORT=5001
```

### MongoDB Connection Failed

- Check if MongoDB is running
- Verify MONGO_URI in .env
- For Atlas: Whitelist your IP address

### Frontend Can't Connect to Backend

- Verify backend is running on port 5000
- Check proxy setting in client/package.json
- Clear browser cache and restart

##  Default Login Credentials

After registration, use these for testing:

**Admin:**

- Email: admin@example.com
- Password: admin123

**Student:**

- Email: john@example.com
- Password: student123

##  UI Features to Try

 **Modern Design Elements:**

- Smooth animations on hover
- Card-based layouts
- Color-coded status badges
- Responsive tables
- Interactive dashboards
- Real-time statistics

##  Next Steps

1. Explore the [README.md](README.md) for detailed documentation
2. Check API endpoints in Postman collection
3. Customize the UI colors in `client/src/index.css`
4. Add more features as needed

---

**Enjoy building with this system! **
