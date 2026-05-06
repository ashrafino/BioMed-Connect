# Netlify Build Troubleshooting

## Latest Fixes Applied

### Issue 1: Tailwind CSS Native Bindings
**Error**: `Cannot find native binding` with `@tailwindcss/oxide`  
**Fix**: ✅ Switched to Tailwind CSS v3 (stable)

### Issue 2: Missing tailwindcss Module
**Error**: `Cannot find module 'tailwindcss'`  
**Fix**: ✅ Installed and committed tailwindcss v3 to devDependencies

### Issue 3: Node Version Compatibility
**Warning**: `EBADENGINE` - packages require Node >=20.19.0  
**Fix**: ✅ Updated to Node 20 in netlify.toml and .nvmrc

### Issue 4: Build Cache Issues
**Problem**: Netlify might cache old dependencies  
**Fix**: ✅ Changed build command to `npm ci && npm run build` for clean install

## Current Configuration

### Node Version
- **netlify.toml**: `NODE_VERSION = "20"`
- **.nvmrc**: `20`

### Build Command
```bash
npm ci && npm run build
```

`npm ci` ensures:
- Clean installation from package-lock.json
- No cached dependencies
- Reproducible builds

### Dependencies Verified
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.19",
    "postcss": "^8.5.14",
    "autoprefixer": "^10.5.0"
  }
}
```

## If Build Still Fails

### 1. Clear Netlify Build Cache

In Netlify Dashboard:
1. Go to **Site settings** → **Build & deploy**
2. Scroll to **Build settings**
3. Click **Clear cache and retry deploy**

Or use Netlify CLI:
```bash
netlify build --clear-cache
```

### 2. Check Environment Variables

Ensure these are set in Netlify:
- `GEMINI_API_KEY` - Your Gemini API key
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secure random string

### 3. Verify Package Installation

Check Netlify build logs for:
```
✓ tailwindcss installed
✓ postcss installed
✓ autoprefixer installed
```

If any are missing, the package-lock.json might be out of sync.

### 4. Manual Dependency Check

Locally run:
```bash
# Remove node_modules and lockfile
rm -rf node_modules package-lock.json

# Clean install
npm install

# Test build
npm run build

# If successful, commit new lockfile
git add package-lock.json
git commit -m "chore: update package-lock.json"
git push
```

### 5. Check PostCSS Configuration

Verify `postcss.config.js` exists and contains:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 6. Check Tailwind Configuration

Verify `tailwind.config.js` exists and contains:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 7. Verify CSS Imports

Check `src/index.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

NOT:
```css
@import "tailwindcss"; /* ❌ This is v4 syntax */
```

## Build Logs to Check

### Success Indicators
```
✓ Installing dependencies
✓ tailwindcss@3.4.19
✓ postcss@8.5.14
✓ autoprefixer@10.5.0
✓ Building with Vite
✓ dist/index.html
✓ dist/assets/*.css
✓ dist/assets/*.js
```

### Failure Indicators
```
❌ Cannot find module 'tailwindcss'
❌ Cannot find native binding
❌ EBADENGINE
❌ Build script returned non-zero exit code
```

## Testing Locally with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Test build locally (simulates Netlify environment)
netlify build

# Test with functions
netlify dev
```

## Common Issues & Solutions

### Issue: "Module not found: tailwindcss"
**Solution**: 
```bash
npm install -D tailwindcss postcss autoprefixer
git add package.json package-lock.json
git commit -m "fix: ensure tailwindcss is installed"
git push
```

### Issue: "Native binding error"
**Solution**: Already fixed - using Tailwind v3 instead of v4

### Issue: "Node version mismatch"
**Solution**: Already fixed - using Node 20

### Issue: "Build cache causing problems"
**Solution**: Clear Netlify cache or use `npm ci` (already configured)

### Issue: "PostCSS plugin failed"
**Solution**: Verify postcss.config.js and tailwind.config.js exist

## Netlify Configuration Files

### netlify.toml
```toml
[build]
  command = "npm ci && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### .nvmrc
```
20
```

## Deployment Checklist

Before deploying, verify:

- [ ] `tailwindcss` in package.json devDependencies
- [ ] `postcss` in package.json devDependencies
- [ ] `autoprefixer` in package.json devDependencies
- [ ] `package-lock.json` committed
- [ ] `postcss.config.js` exists
- [ ] `tailwind.config.js` exists
- [ ] `netlify.toml` has Node 20
- [ ] `.nvmrc` has Node 20
- [ ] Environment variables set in Netlify
- [ ] Build succeeds locally: `npm run build`
- [ ] Netlify Functions exist in `netlify/functions/`

## Getting Help

If issues persist:

1. **Check Netlify build logs** - Full error details
2. **Check this repo's Issues** - Similar problems
3. **Netlify Support Docs**: https://docs.netlify.com/
4. **Tailwind CSS Docs**: https://tailwindcss.com/docs
5. **Vite Docs**: https://vitejs.dev/

## Status

✅ **All known issues fixed**
✅ **Build tested locally**
✅ **Configuration updated**
✅ **Pushed to GitHub**

**Next**: Netlify should automatically redeploy with these fixes.

---

**Last updated**: May 6, 2026  
**Commits**: 
- `317db0e` - Switch to Tailwind v3
- `0bcdc13` - Update Node version and build command
