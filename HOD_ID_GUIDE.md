# HOD ID Management Guide

## System Overview

Admin ke liye HOD accounts create karne ka complete system hai jisme admin manually HOD IDs assign karta hai aur HOD us ID ke saath register kar sakta hai.

## Admin: HOD IDs Create Karna

### Method 1: Seed File Use Karke (Multiple HODs)

1. **File**: `seedMultipleHODs.js`
2. **Command**: `node seedMultipleHODs.js`

Is file me admin multiple HOD accounts create kar sakta hai:

```javascript
const HOD_ACCOUNTS = [
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@college.com",
    password: "TempPass123",
    department: "Computer Science",
    hodId: "HOD_CS_001", // Manually assigned HOD ID
    role: "hod",
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@college.com",
    password: "TempPass123",
    department: "Information Technology",
    hodId: "HOD_IT_001", // Different HOD ID
    role: "hod",
  },
  // Add more HODs here...
];
```

**HOD ID Format**:

- `HOD_[DEPARTMENT]_[NUMBER]`
- Examples: `HOD_CS_001`, `HOD_IT_001`, `HOD_ME_002`

### Method 2: Direct Database Insert (MongoDB)

MongoDB Compass ya Mongo Shell use karke:

```javascript
db.users.insertOne({
  name: "Dr. New HOD",
  email: "newhod@college.com",
  password: "$2a$10$hashedPassword...", // Hashed password
  department: "Computer Science",
  hodId: "HOD_CS_003",
  role: "hod",
  createdAt: new Date(),
});
```

## HOD: Registration Process

### Step 1: Admin se HOD ID Prapt Karna

- Admin HOD ko email/message karke HOD ID dega
- Example: "Aapki HOD ID hai: HOD_CS_001"

### Step 2: Registration Page Pe Jaye

1. Registration page open kare
2. **HOD Registration** tab select kare
3. Form fill kare:
   - **Full Name**: Apna naam
   - **Email**: Official email
   - **HOD ID**: Admin dwara di gayi ID (e.g., HOD_CS_001)
   - **Department**: Department name
   - **Password**: Apna password (minimum 6 characters)
   - **Confirm Password**: Password dobara enter kare

### Step 3: Register Button Click Kare

- System check karega ki HOD ID valid hai
- Agar ID valid nahi hai, error dikhaega
- Agar sab theek hai, account create ho jaega

## HOD: Login Process

HOD 2 tareekon se login kar sakta hai:

### Option 1: Email Use Karke

- Login page pe HOD tab select kare
- Email field me: `rajesh.kumar@college.com`
- Password enter kare

### Option 2: HOD ID Use Karke

- Login page pe HOD tab select kare
- Email field me: `HOD_CS_001`
- Password enter kare

## Important Notes

1. **Security**:

   - Seed file se create kiye gaye HODs ko first login ke baad password change karna chahiye
   - Password strong hona chahiye

2. **HOD ID Uniqueness**:

   - Har HOD ID unique honi chahiye
   - Same ID do HODs ke liye use nahi ho sakti

3. **Registration Validation**:

   - HOD registration me HOD ID required field hai
   - Bina HOD ID ke registration nahi ho sakti
   - Admin se HOD ID lene ke baad hi register kare

4. **Adding More HODs**:
   - `seedMultipleHODs.js` file me HOD_ACCOUNTS array me nayi entry add kare
   - Command run kare: `node seedMultipleHODs.js`

## Example: Complete Flow

```
Admin (Backend):
1. seedMultipleHODs.js me entry add kare:
   {
     name: 'Dr. Amit Kumar',
     email: 'amit@college.com',
     password: 'TempPass123',
     department: 'Computer Science',
     hodId: 'HOD_CS_002',
     role: 'hod'
   }
2. Run: node seedMultipleHODs.js

HOD (Frontend):
1. Registration page pe jaye
2. HOD tab select kare
3. Form fill kare with hodId: 'HOD_CS_002'
4. Register kare
5. Login kare (email ya HOD ID se)
```

## Troubleshooting

**Error: "HOD ID is required"**

- Solution: Admin se HOD ID le aur registration form me enter kare

**Error: "HOD ID already exists"**

- Solution: Admin se nayi unique HOD ID le

**Error: "Invalid credentials"**

- Solution: Email/HOD ID aur password check kare
