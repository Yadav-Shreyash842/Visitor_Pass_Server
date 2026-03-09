# Visitor Pass Management System - Backend Deployment Guide

## 🚀 Deployment Options for Node.js/Express Backend

### Option 1: Render (Recommended - Free Tier Available)

1. **Create account at:** https://render.com

2. **Create New Web Service:**
   - Connect your GitHub repository
   - Select `server` folder (or push server separately)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables

3. **Environment Variables:**
   ```
   PORT=3000
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=production
   ```

4. **Get Deploy URL:**
   - Copy the URL (e.g., `https://your-app.onrender.com`)
   - Use this in frontend `VITE_API_URL`

### Option 2: Railway

1. **Create account at:** https://railway.app

2. **Deploy:**
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway auto-detects Node.js

3. **Add Environment Variables:**
   - Go to Variables tab
   - Add all required variables from `.env`

4. **Custom Domain (Optional):**
   - Go to Settings → Generate Domain

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App:**
   ```bash
   heroku login
   heroku create visitor-pass-api
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set MONGO_URI=your-connection-string
   heroku config:set JWT_SECRET=your-secret
   heroku config:set EMAIL_USER=your-email
   heroku config:set EMAIL_PASS=your-password
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 4: AWS EC2 (Advanced)

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)

2. **Connect via SSH:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and Setup:**
   ```bash
   git clone your-repo
   cd server
   npm install
   pm2 start server.js --name visitor-pass-api
   pm2 startup
   pm2 save
   ```

6. **Install Nginx:**
   ```bash
   sudo apt install nginx
   # Configure as reverse proxy
   ```

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas setup (if not using local DB)
- [ ] Update CORS to allow frontend domain
- [ ] Test API endpoints locally
- [ ] Ensure all environment variables are set
- [ ] Email service configured (Gmail app password)
- [ ] Remove sensitive data from code
- [ ] Set NODE_ENV=production

## 🔧 Environment Variables Required

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=production
```

## 🔐 Security Considerations

1. **Update CORS in `server.js`:**
   ```javascript
   const corsOptions = {
     origin: process.env.NODE_ENV === 'production' 
       ? 'https://your-frontend-domain.com'
       : 'http://localhost:5173',
     credentials: true
   };
   app.use(cors(corsOptions));
   ```

2. **Add Rate Limiting:**
   ```bash
   npm install express-rate-limit
   ```
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

3. **Helmet for Security Headers:**
   (Already installed in your project)
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

## 📊 MongoDB Atlas Setup

1. **Create free cluster:** https://www.mongodb.com/cloud/atlas

2. **Create Database User:**
   - Database Access → Add New User
   - Save username and password

3. **Whitelist IP:**
   - Network Access → Add IP Address
   - For deployment: Allow access from anywhere (0.0.0.0/0)

4. **Get Connection String:**
   - Clusters → Connect → Connect Your Application
   - Copy connection string
   - Replace `<password>` with your password

## 📧 Gmail App Password Setup

1. **Enable 2FA on Gmail:**
   - Google Account → Security → 2-Step Verification

2. **Generate App Password:**
   - Google Account → Security → App passwords
   - Select "Mail" and "Other"
   - Copy the 16-character password

3. **Use in Environment Variables:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=16-character-app-password
   ```

## 🎯 Deployment Steps (Render Example)

```bash
# 1. Create .gitignore in server folder
echo "node_modules
.env
*.log" > .gitignore

# 2. Initialize git (if not already)
git init

# 3. Add remote (create repo on GitHub first)
git remote add origin https://github.com/username/visitor-pass-backend.git

# 4. Commit and push
git add .
git commit -m "Initial backend commit"
git push -u origin main

# 5. Go to Render.com
# - New Web Service
# - Connect GitHub repo
# - Configure settings
# - Add environment variables
# - Deploy!
```

## 🔄 Update CORS After Deployment

In `server/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app',
  'https://your-frontend-domain.netlify.app'
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

## 🧪 Testing Deployed Backend

```bash
# Test health check
curl https://your-backend-url.com/

# Test login endpoint
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📱 Connect Frontend to Backend

Update frontend `.env`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

Rebuild and redeploy frontend after this change!

## 🆘 Troubleshooting

**Problem:** MongoDB connection timeout
- **Solution:** Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)

**Problem:** Email not sending
- **Solution:** Verify app password, check Gmail security settings

**Problem:** 502 Bad Gateway
- **Solution:** Check if server is running, verify start command

**Problem:** CORS errors
- **Solution:** Update allowed origins, check frontend URL

## ⚡ Performance Tips

1. **Enable compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Use PM2 with cluster mode (EC2):**
   ```bash
   pm2 start server.js -i max
   ```

3. **Add caching headers for static content**

4. **Use Redis for session management (optional)**

## 📈 Monitoring

- **Render:** Built-in logs and metrics
- **Railway:** Real-time logs in dashboard
- **PM2 (EC2):** `pm2 monit` or `pm2 logs`
- **Consider:** Sentry for error tracking

## 🔄 Continuous Deployment

Most platforms auto-deploy on git push:
- **Render:** Auto-deploys from GitHub
- **Railway:** Auto-deploys on every push
- **Heroku:** Manual push or GitHub integration

## 📝 Quick Deploy Checklist

```
☐ MongoDB Atlas cluster created
☐ Database user created
☐ IP whitelist configured  
☐ Connection string obtained
☐ Gmail app password generated
☐ .env variables prepared
☐ CORS configured for frontend domain
☐ Code pushed to GitHub
☐ Hosting platform configured
☐ Environment variables set
☐ Backend deployed and tested
☐ Frontend updated with backend URL
☐ Frontend redeployed
☐ End-to-end testing completed
```
