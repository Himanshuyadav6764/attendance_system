# Vercel Deployment Guide

## Environment Variables Required

Set these in Vercel Dashboard (Settings > Environment Variables):

```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=your_vercel_app_url
```

## Important Notes

1. Never commit `.env` files or put credentials in `vercel.json`
2. Set all environment variables in Vercel Dashboard
3. After setting env variables, redeploy the app
4. Make sure MongoDB allows connections from Vercel IPs (0.0.0.0/0)
