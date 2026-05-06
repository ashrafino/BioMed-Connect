# Netlify Deployment Checklist

Use this checklist to ensure your deployment is configured correctly.

## Pre-Deployment

- [ ] All dependencies are listed in `package.json`
- [ ] Project builds successfully locally (`npm run build`)
- [ ] Environment variables are documented
- [ ] Firebase configuration is correct
- [ ] `.gitignore` excludes sensitive files

## Netlify Configuration

- [ ] `netlify.toml` is configured
- [ ] Build command is set: `npm run build`
- [ ] Publish directory is set: `dist`
- [ ] Redirects are configured for SPA routing

## Environment Variables

Set these in Netlify dashboard (Site settings → Environment variables):

- [ ] `GEMINI_API_KEY` - Your Gemini API key

## Firebase Setup

- [ ] Firebase project is created
- [ ] Firestore database is configured
- [ ] Authentication is enabled
- [ ] Security rules are deployed
- [ ] **Add Netlify domain to Firebase authorized domains**
  - Go to Firebase Console → Authentication → Settings → Authorized domains
  - Add: `your-app-name.netlify.app`

## Post-Deployment Testing

- [ ] Site loads correctly
- [ ] Authentication works (Google Sign-In)
- [ ] Firestore reads/writes work
- [ ] Gemini AI integration works
- [ ] All routes work (no 404s)
- [ ] Mobile responsive design works
- [ ] Console has no errors

## Optional: GitHub Actions

If using automated deployments:

- [ ] GitHub repository is created
- [ ] Code is pushed to GitHub
- [ ] GitHub Secrets are configured:
  - `NETLIFY_AUTH_TOKEN`
  - `NETLIFY_SITE_ID`
  - `GEMINI_API_KEY`
- [ ] Workflow file is in `.github/workflows/`
- [ ] First deployment runs successfully

## Security

- [ ] API keys are not committed to repository
- [ ] Firestore security rules are restrictive
- [ ] CORS is configured if needed
- [ ] HTTPS is enabled (automatic with Netlify)

## Performance

- [ ] Build output is optimized
- [ ] Code splitting is working
- [ ] Assets are compressed
- [ ] Lighthouse score is acceptable

## Monitoring

- [ ] Netlify analytics enabled (optional)
- [ ] Error tracking configured (optional)
- [ ] Custom domain configured (optional)

## Troubleshooting

If deployment fails, check:

1. Build logs in Netlify dashboard
2. Environment variables are set correctly
3. Node version matches local development
4. All dependencies are installed
5. Firebase configuration is correct

## Quick Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Deploy using script
./deploy.sh

# Deploy using CLI
netlify deploy --prod

# Check deployment status
netlify status

# View logs
netlify logs

# Open site
netlify open:site
```

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Deployment Guide](./DEPLOYMENT.md)
