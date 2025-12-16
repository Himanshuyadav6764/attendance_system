# Attendance & Leave Management System - Deployment Guide

## 🚀 Deploying to Vercel

This MERN stack application can be deployed on Vercel with the following setup:

### Prerequisites

- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas database (already configured)
- GitHub repository

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (already done with this guide)

2. **Import Project to Vercel:**

   - Go to https://vercel.com/new
   - Import your GitHub repository: `Himanshuyadav6764/attendance_system`
   - Vercel will auto-detect it as a Node.js project

3. **Configure Environment Variables:**
   Add these in Vercel Dashboard → Settings → Environment Variables:

   ```
   MONGO_URI=mongodb+srv://majorproject:ZOiqeHUs3xvt3Fu4@cluster0.mfempxz.mongodb.net/majorproject?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=a8f5e9c2d7b4a1f6e3c8d9b2a5f7e4c1d8b6a3f9e2c7d4b1a8f5e3c9d6b2a7f4e1c8d5b3a6f9e2c4d7b1a5f8e3c6d9b2a4f7e1c5d8b6a3f9e2c7d4b1a8f5e3c9d6
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-app-name.vercel.app
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Important Notes

⚠️ **Backend Deployment:**
This setup uses Vercel's serverless functions. The `vercel.json` file configures the backend to run as serverless API routes.

⚠️ **Frontend:**
The React app will be built and served as static files.

⚠️ **CORS Configuration:**
After deployment, update the `CLIENT_URL` environment variable with your actual Vercel URL.

### Alternative: Separate Deployments

For better performance, consider deploying frontend and backend separately:

**Frontend (Vercel):**

- Deploy the `client` folder only
- Set `REACT_APP_API_URL` environment variable to your backend URL

**Backend (Render/Railway/Heroku):**

- Deploy the root folder (excluding client)
- Better for persistent connections and background tasks

### Post-Deployment Checklist

- [ ] Update `CLIENT_URL` in Vercel environment variables
- [ ] Test authentication flow
- [ ] Verify MongoDB connection
- [ ] Check API endpoints
- [ ] Test file uploads (if any)

### Troubleshooting

**Build Fails:**

- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility

**API Not Working:**

- Verify environment variables are set correctly
- Check CORS configuration
- Review Vercel function logs

**Database Connection Issues:**

- Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check connection string format

### Support

For issues, check:

- Vercel deployment logs
- MongoDB Atlas logs
- Browser console for frontend errors

## 📱 Live URL

After deployment: `https://your-app-name.vercel.app`
