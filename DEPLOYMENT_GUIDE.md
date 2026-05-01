# Deployment Guide for Task Manager

## Deployment on Railway

Railway is an excellent platform for deploying Node.js and React applications. Here's how to deploy the Task Manager:

### Prerequisites

- GitHub account with code pushed
- Railway account (https://railway.app)
- MongoDB Atlas account (free tier available)

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-manager.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. Go to https://railway.app
2. Create new project → "Deploy from GitHub"
3. Select your repository
4. Select the "backend" folder as the root directory
5. Set environment variables:
   - PORT: 5000
   - NODE_ENV: production
   - MONGODB_URI: (your MongoDB Atlas URI)
   - JWT_SECRET: (generate a strong secret)
   - JWT_REFRESH_SECRET: (generate another secret)
   - FRONTEND_URL: (your frontend URL)
6. Deploy

### Step 3: Deploy Frontend on Railway

1. Create another project in Railway
2. Select same repository
3. Select "frontend" folder as root directory
4. Set environment variables:
   - REACT_APP_API_URL: (your backend Railway URL/api/v1)
5. Deploy

### Step 4: Configure MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in backend environment variables

### Step 5: Update FRONTEND_URL

1. Get your frontend Railway URL
2. Update FRONTEND_URL in backend environment variables
3. Redeploy backend

## Deployment on Vercel (Frontend) & Heroku (Backend)

### Backend on Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create task-manager-api

# Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Frontend on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=your_heroku_url/api/v1
```

## Environment Variables for Production

### Backend

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task_manager
JWT_SECRET=your_strong_random_secret_32_chars_minimum
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_strong_random_refresh_secret
FRONTEND_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
LOG_LEVEL=info
```

### Frontend

```env
REACT_APP_API_URL=https://your-backend-url/api/v1
REACT_APP_ENV=production
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## Using Docker for Deployment

### Build and Run Locally with Docker

```bash
# Build images
docker build -t task-manager-backend ./backend
docker build -t task-manager-frontend ./frontend

# Run with docker-compose
docker-compose up

# Access the app at http://localhost:3000
```

### Deploy Docker Image to Cloud

1. **Using Railway with Docker:**
   - Connect your GitHub repo
   - Railway will automatically detect and deploy Docker containers

2. **Using AWS ECR + ECS:**
   - Push Docker image to AWS ECR
   - Create ECS task definition
   - Deploy to ECS cluster

3. **Using Google Cloud Run:**
   - Push to Google Container Registry
   - Deploy using: `gcloud run deploy`

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: cd backend && npm install && npm test

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: cd frontend && npm install && npm run build
```

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads without errors
- [ ] Database connection is working
- [ ] Authentication works (signup/login)
- [ ] JWT tokens are being issued
- [ ] CORS is configured correctly
- [ ] SSL/HTTPS is enabled
- [ ] Environment variables are set
- [ ] Database backups are enabled
- [ ] Monitoring and logs are set up
- [ ] Rate limiting is enabled
- [ ] Security headers are configured

## Troubleshooting Deployment

### Backend won't start

```bash
# Check logs
heroku logs --tail  # for Heroku
railway logs        # for Railway

# Verify environment variables
heroku config      # for Heroku
```

### CORS errors

- Ensure FRONTEND_URL is set correctly in backend
- Check CORS middleware in Express

### Database connection issues

- Verify MONGODB_URI format
- Check IP whitelist in MongoDB Atlas
- Test connection locally first

### Frontend not connecting to backend

- Verify REACT_APP_API_URL
- Check browser console for errors
- Verify backend is running and accessible

---

For more help, visit:

- Railway: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- React deployment: https://create-react-app.dev/deployment
