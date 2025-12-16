# Login Issue Fix Guide

## Problem Identified

The login was failing because the frontend was trying to connect to `http://localhost:5000/api` even when deployed on Vercel.

## Changes Made

### 1. Environment Files Created

- **client/.env** - Base configuration
- **client/.env.development** - For local development (uses `http://localhost:5000/api`)
- **client/.env.production** - For production (uses `/api` for relative URLs)

### 2. Updated Files

- **client/src/services/api.js** - Changed default API URL to `/api` for production
- **server.js** - Enhanced CORS configuration
- **vercel.json** - Added environment variables

## Deployment Steps

### Step 1: Configure Vercel Environment Variables

You need to add these **environment secrets** in Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following secrets:

```
Name: mongo_uri
Value: mongodb+srv://majorproject:ZOiqeHUs3xvt3Fu4@cluster0.mfempxz.mongodb.net/majorproject?retryWrites=true&w=majority&appName=Cluster0

Name: jwt_secret
Value: a8f5e9c2d7b4a1f6e3c8d9b2a5f7e4c1d8b6a3f9e2c7d4b1a8f5e3c9d6b2a7f4e1c8d5b3a6f9e2c4d7b1a5f8e3c6d9b2a4f7e1c5d8b6a3f9e2c7d4b1a8f5e3c9d6
```

### Step 2: Redeploy to Vercel

Run the following commands:

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Fix login issue - Update API configuration for Vercel deployment"

# Push to trigger Vercel deployment
git push
```

### Step 3: Verify Deployment

After deployment completes:

1. Clear your browser cache (Ctrl + Shift + Delete)
2. Try logging in again with your credentials
3. Check browser console (F12) for any errors

## For Local Development

To run locally:

```bash
# Terminal 1 - Start backend
npm start

# Terminal 2 - Start frontend
cd client
npm start
```

The app will use `http://localhost:5000/api` automatically in development mode.

## Testing Login

### Test Credentials

Make sure you have registered a user first:

**If you haven't registered yet:**

1. Click "Register Here" on the login page
2. Fill in the registration form
3. Select role (student/admin)
4. Register and then login

**If you already have an account:**

- Email: yadavhimanshu@gmail.com
- Password: [your password]

## Troubleshooting

### If login still fails after deployment:

1. **Check Vercel Logs:**

   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment → View Function Logs
   - Look for errors in `/api/auth/login` endpoint

2. **Verify MongoDB Connection:**

   - Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Check if the IP whitelist includes Vercel IPs

3. **Test API Directly:**

   ```bash
   curl -X POST https://attendance-system-coral-eight.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

4. **Browser Console:**
   - Open DevTools (F12)
   - Check Network tab for failed requests
   - Look for CORS errors or 401/500 status codes

## Common Issues

### CORS Error

If you see CORS errors, make sure `CLIENT_URL` environment variable in Vercel is set to:

```
https://attendance-system-coral-eight.vercel.app
```

### MongoDB Connection Error

- Verify MONGO_URI is correctly set in Vercel environment variables
- Check MongoDB Atlas network access settings

### 401 Unauthorized

- Ensure the email and password are correct
- Verify the user exists in the database
- Check if JWT_SECRET is properly set

## Need Help?

If the issue persists, check:

1. Vercel deployment logs
2. Browser console errors
3. Network tab in DevTools
4. MongoDB Atlas logs
