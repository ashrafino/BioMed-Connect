# Netlify Deployment Guide

This guide will help you deploy your React + Firebase + Gemini AI application to Netlify.

## Prerequisites

- A [Netlify account](https://app.netlify.com/signup)
- A [Gemini API key](https://aistudio.google.com/app/apikey)
- Firebase project configured (already set up in this project)

## Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   ```
   
   Follow the prompts:
   - Create & configure a new site
   - Choose your team
   - Site name: (choose a unique name)
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set Environment Variables**
   ```bash
   netlify env:set GEMINI_API_KEY "your-gemini-api-key-here"
   netlify env:set MONGODB_URI "your-mongodb-connection-string"
   netlify env:set JWT_SECRET "your-secure-jwt-secret"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Web UI

1. **Push to Git Repository**
   - Push your code to GitHub, GitLab, or Bitbucket

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following variables:
     - `GEMINI_API_KEY`: Your Gemini API key
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT tokens

5. **Deploy**
   - Click "Deploy site"

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes (default provided) |
| `JWT_SECRET` | Secret key for JWT tokens | Yes (generate secure key) |

## Post-Deployment Configuration

### MongoDB Database Setup

Your MongoDB database is already configured with the connection string. The application will automatically:
- Create collections as needed (users, pannes)
- Handle user authentication with bcrypt password hashing
- Store all data in MongoDB instead of Firestore

No additional MongoDB configuration is required unless you want to:
1. Set up database indexes for better performance
2. Configure backup strategies
3. Set up monitoring and alerts

## Continuous Deployment

Once connected to Git, Netlify will automatically deploy:
- **Production**: When you push to your main/master branch
- **Preview**: When you create a pull request

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify Node version is 18 or higher
- Check build logs in Netlify dashboard

### Environment Variables Not Working

- Ensure variables are set in Netlify dashboard
- Redeploy after adding/changing environment variables
- Variables should not have quotes in Netlify UI

### Firebase Authentication Issues

- This app now uses MongoDB with JWT authentication instead of Firebase
- No Firebase configuration needed

### API Calls Failing

- Verify `GEMINI_API_KEY` is set correctly
- Check browser console for CORS errors
- Ensure API key has proper permissions

## Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Create .env.local file
echo "GEMINI_API_KEY=your-key-here" > .env.local

# Run development server
npm run dev

# Build for production (test build)
npm run build

# Preview production build locally
npm run preview
```

## Useful Commands

```bash
# Check deployment status
netlify status

# View site logs
netlify logs

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin
```

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
