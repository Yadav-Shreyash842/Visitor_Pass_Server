# Environment Variables for Render Deployment

Copy these to your Render dashboard when deploying:

## Required Environment Variables

```
PORT=3000

MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Visitor_pass

JWT_SECRET=your-super-secret-jwt-key-here

EMAIL_USER=your-email@gmail.com

EMAIL_PASS=your-gmail-app-password

NODE_ENV=production
```

## ⚠️ IMPORTANT: MongoDB Atlas Configuration

Before deploying, update MongoDB Atlas IP whitelist:

1. Go to https://cloud.mongodb.com
2. Navigate to "Network Access" 
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

This allows Render servers to connect to your database.

## 📝 Step-by-Step Render Deployment:

### Step 1: Go to Render
1. Visit https://render.com
2. Sign up or Login with GitHub

### Step 2: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub account (if not already)
4. Select repository: `Visitor_Pass_Server`
5. Click "Connect"

### Step 3: Configure Service
Fill in these settings:

**Name:** `visitor-pass-api` (or any name you prefer)

**Region:** Choose closest to your location

**Branch:** `main`

**Root Directory:** Leave empty (or `.` if needed)

**Runtime:** `Node`

**Build Command:** 
```
npm install
```

**Start Command:**
```
npm start
```

**Instance Type:** `Free` (for testing)

### Step 4: Add Environment Variables
Click "Advanced" → "Environment Variables" → Add each one:

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/Visitor_pass` |
| `JWT_SECRET` | `your-super-secret-jwt-key` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASS` | `your-gmail-app-password` |
| `NODE_ENV` | `production` |

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Once deployed, you'll see: ✅ "Live"
4. Copy your service URL: `https://visitor-pass-api.onrender.com`

### Step 6: Test Your API
After deployment, test with:
```bash
curl https://your-app-name.onrender.com/
```

You should see:
```json
{"message": "Vister Pass syatem API is running"}
```

### Step 7: Update Frontend
Update your frontend `.env` file:
```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

Then rebuild and redeploy frontend!

## 🔄 After Deployment

### Update CORS in server.js
After you deploy frontend, update the CORS configuration:

1. Go to your GitHub repository
2. Edit `server/server.js`
3. Change CORS line to:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app', // Add your frontend URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

4. Commit and push - Render auto-deploys!

## 🚨 Common Issues & Solutions

**Issue 1: MongoDB Connection Timeout**
- Solution: Add 0.0.0.0/0 to MongoDB Atlas IP whitelist

**Issue 2: Email not sending**
- Solution: Verify Gmail app password is correct
- Check: 2FA is enabled on Gmail account

**Issue 3: CORS errors**
- Solution: Add frontend URL to allowed origins in `server.js`

**Issue 4: Service keeps restarting**
- Solution: Check logs in Render dashboard
- Verify all environment variables are set correctly

## 📊 Monitoring

Monitor your deployment:
1. Go to Render Dashboard
2. Click your service
3. View "Logs" tab for real-time logging
4. Check "Metrics" for performance

## 💰 Render Free Tier Info

- 512 MB RAM
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free

## 🔐 Security Checklist

✅ Environment variables set in Render (not in code)
✅ MongoDB IP whitelist configured
✅ JWT secret is strong and unique
✅ .env file in .gitignore
✅ Gmail app password (not regular password)
✅ CORS configured for frontend domain

## 📝 Quick Copy-Paste for Render

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Environment Variables (Copy all at once):**
```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Visitor_pass
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=production
```

## ✅ Deployment Complete!

After deployment:
1. ✅ Backend URL: `https://your-app.onrender.com`
2. ✅ Test API endpoint
3. ✅ Deploy frontend with this backend URL
4. ✅ Update CORS
5. ✅ Test full application

---

Need help? Check Render logs or contact support!
