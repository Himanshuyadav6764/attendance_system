# HOD Management System Guide

## Overview

Ab aap database me multiple HOD accounts create kar sakte ho backend se.

## Multiple HOD Accounts Banana (Seeding)

### Option 1: Script se Multiple HODs Banana

File me already 4 HODs defined hain, aap zyada add kar sakte ho.

**File Edit Karo:** `seedMultipleHODs.js`

```javascript
const HOD_ACCOUNTS = [
  {
    name: "Head of Department - CS",
    email: "hod.cs@college.com",
    password: "HOD123",
    department: "Computer Science",
    role: "hod",
  },
  // Aur HODs yaha add karo
  {
    name: "Your HOD Name",
    email: "hod.email@college.com",
    password: "password123",
    department: "Department Name",
    role: "hod",
  },
];
```

**Run Command:**

```bash
npm run seed:multiple-hods
```

Yeh saare HODs database me create ho jayenge!

---

## API Routes - Backend se HOD Manage Karo

### 1. New HOD Create Karo

**Endpoint:** `POST /api/hod`

**Postman/API Call:**

```json
{
  "name": "HOD Name",
  "email": "hod@college.com",
  "password": "password123",
  "department": "Computer Science"
}
```

**Required:** Login as HOD (Bearer Token)

---

### 2. Saare HODs Dekho

**Endpoint:** `GET /api/hod`

**Required:** Login as HOD

Yeh sabhi HODs ki list dega.

---

### 3. HOD Details Update Karo

**Endpoint:** `PUT /api/hod/:id`

**Body:**

```json
{
  "name": "Updated Name",
  "email": "newemail@college.com",
  "department": "New Department"
}
```

**Required:** Login as HOD

---

### 4. HOD Delete Karo

**Endpoint:** `DELETE /api/hod/:id`

**Required:** Login as HOD

---

### 5. HOD Password Reset Karo

**Endpoint:** `PUT /api/hod/:id/reset-password`

**Body:**

```json
{
  "newPassword": "newpassword123"
}
```

**Required:** Login as HOD

---

## Quick Start

### Step 1: Multiple HODs Create Karo

```bash
cd c:\major_project
npm run seed:multiple-hods
```

### Step 2: Server Start Karo

```bash
npm start
```

### Step 3: Postman ya Frontend se Test Karo

- Login as HOD
- Bearer Token use karo
- API endpoints call karo

---

## Default HOD Accounts (After seeding)

| Department                  | Email               | Password |
| --------------------------- | ------------------- | -------- |
| Computer Science            | hod.cs@college.com  | HOD123   |
| Information Technology      | hod.it@college.com  | HOD123   |
| Electronics & Communication | hod.ece@college.com | HOD123   |
| Mechanical Engineering      | hod.me@college.com  | HOD123   |

---

## Important Notes

1. **Only HOD** can create/update/delete other HODs
2. Saare HOD routes **protected** hain (authentication required)
3. Password automatically **encrypted** ho jata hai
4. Email **unique** hona chahiye
5. Purane HOD emails ko update kar sakte ho

---

## Example: Postman se HOD Create Karo

1. **Login karo as HOD:**

   - POST: `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "hod.cs@college.com", "password": "HOD123" }`
   - Response me **token** milega

2. **New HOD Create Karo:**

   - POST: `http://localhost:5000/api/hod`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body:

   ```json
   {
     "name": "New HOD",
     "email": "newhod@college.com",
     "password": "password123",
     "department": "Civil Engineering"
   }
   ```

3. **Done!** New HOD created.

---

## Troubleshooting

**Error: "Email already exists"**

- Yeh email already use ho raha hai, dusra email use karo

**Error: "Not authorized"**

- Check karo ki aap HOD account se login ho
- Bearer token sahi hai ya nahi check karo

**Error: "Database connection failed"**

- MongoDB running hai ya nahi check karo
- .env file me MONGO_URI sahi hai ya nahi

---

## Next Steps

Ab aap chahte ho to frontend me bhi HOD management UI bana sakte ho jaha se:

- New HODs create kar sako
- Existing HODs edit kar sako
- HODs ka list dekh sako
- Password reset kar sako

Batao agar frontend UI bhi chahiye! 🚀
