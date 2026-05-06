# Quick Netlify Setup Guide

## What's Been Configured

Your project is now ready for Netlify deployment with the following files:

### Configuration Files

1. **`netlify.toml`** - Main Netlify configuration
   - Build command: `npm run build`
   - Publish directory: `dist`
   - SPA redirects configured
   - Environment settings for production and preview

2. **`_redirects`** - Backup redirect rules for SPA routing

3. **`vite.config.ts`** - Updated with optimized build settings
   - Code splitting for React and Firebase
   - Optimized bundle output

### Documentation

1. **`DEPLOYMENT.md`** - Complete deployment guide with:
   - CLI deployment instructions
   - Web UI deployment instructions
   - Environment variable setup
   - Troubleshooting tips

2. **`DEPLOYMENT_CHECKLIST.md`** - Step-by-step checklist

3. **`README.md`** - Updated with deployment quick start

### Helper Scripts

1. **`deploy.sh`** - Automated deployment script
   - Checks for Netlify CLI
   - Builds the project
   - Deploys to Netlify
   - Sets environment variables

### CI/CD (Optional)

1. **`.github/workflows/netlify-deploy.yml`** - GitHub Actions workflow
   - Automatic deployment on push to main/master
   - Preview deployments for pull requests

## Quick Start

### Option 1: Using the Deploy Script (Easiest)

```bash
./deploy.sh
```

### Option 2: Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set GEMINI_API_KEY "your-api-key-here"
netlify env:set MONGODB_URI "your-mongodb-uri"
netlify env:set JWT_SECRET "your-secure-jwt-secret"

# Deploy
netlify deploy --prod
```

### Option 3: Deploy via Git

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable `GEMINI_API_KEY`
7. Deploy!

## Important: Post-Deployment Steps

### 1. Verify MongoDB Connection

The app is configured to use MongoDB with the connection string:
```
mongodb+srv://VentureLens:4X32tXo3LeytErBx@cluster0.fvcvl.mongodb.net/venturelens?retryWrites=true&w=majority&appName=Cluster0
```

The database will automatically:
- Create collections (`users`, `pannes`) as needed
- Handle authentication with JWT tokens
- Store all application data

### 2. Test Your Deployment

- [ ] Visit your Netlify URL
- [ ] Create a new account (register)
- [ ] Test login functionality
- [ ] Test creating/viewing pannes
- [ ] Check browser console for errors
- [ ] Test on mobile device

Without this step, Google Sign-In will not work!

## Environment Variables Required

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | [Get API Key](https://aistudio.google.com/app/apikey) |
| `MONGODB_URI` | MongoDB connection string | Already provided in code |
| `JWT_SECRET` | Secret for JWT tokens | Generate secure random string |

## Project Structure

```
.
├── netlify.toml              # Netlify configuration
├── _redirects                # SPA routing rules
├── deploy.sh                 # Deployment helper script
├── DEPLOYMENT.md             # Full deployment guide
├── DEPLOYMENT_CHECKLIST.md   # Deployment checklist
├── .github/
│   └── workflows/
│       └── netlify-deploy.yml # GitHub Actions (optional)
├── src/                      # Your React app
├── dist/                     # Build output (generated)
└── package.json              # Dependencies and scripts
```

## Troubleshooting

### Build Fails

```bash
# Test build locally first
npm install
npm run build
```

### Authentication Not Working

- Check Firebase authorized domains
- Verify `firebase-applet-config.json` is correct
- Check browser console for errors

### Environment Variables Not Working

- Redeploy after setting environment variables
- Check variable names match exactly
- Don't use quotes in Netlify UI

### 404 Errors on Routes

- Verify `netlify.toml` has redirect rules
- Check `_redirects` file exists
- Ensure SPA routing is configured

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Add Netlify domain to Firebase
3. ✅ Test all functionality
4. 🎯 Configure custom domain (optional)
5. 🎯 Set up monitoring (optional)
6. 🎯 Enable Netlify Analytics (optional)

## Support

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step guide
- Check [Netlify Documentation](https://docs.netlify.com/)
- Check [Firebase Documentation](https://firebase.google.com/docs)

---

**Ready to deploy?** Run `./deploy.sh` or follow the manual steps above!
