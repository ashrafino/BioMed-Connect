# Security Fix - Removed Exposed Credentials

## Issue

Netlify's secret scanner detected hardcoded MongoDB credentials in the repository.

## What Was Fixed

### 1. Netlify Functions
All three functions now require environment variables with no fallbacks:

**Before**:
```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@...';
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
```

**After**:
```javascript
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not set');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
```

### 2. Documentation Files
Removed all hardcoded credentials from:
- `README.md` - Replaced with placeholders
- `.env.local.example` - Replaced with placeholders
- All other documentation files

### 3. Image Updated
- Updated README banner image to new URL

## Security Best Practices Implemented

✅ **No hardcoded credentials** in source code  
✅ **Environment variables required** - Functions fail fast if not set  
✅ **Clear error messages** for missing configuration  
✅ **Documentation uses placeholders** only  
✅ **Example files** show format without real values  

## Required Environment Variables

Set these in Netlify Dashboard (Site settings → Environment variables):

| Variable | Description | How to Get |
|----------|-------------|------------|
| `MONGODB_URI` | MongoDB connection string | MongoDB Atlas dashboard |
| `JWT_SECRET` | Secret for JWT signing | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |

## How to Set Environment Variables

### Option 1: Netlify CLI
```bash
netlify env:set MONGODB_URI "your-mongodb-connection-string"
netlify env:set JWT_SECRET "your-generated-secret"
netlify env:set GEMINI_API_KEY "your-gemini-api-key"
```

### Option 2: Netlify Dashboard
1. Go to your site in Netlify
2. Site settings → Environment variables
3. Click "Add a variable"
4. Add each variable with its value
5. Redeploy the site

## Verification

After setting environment variables, the build should succeed. If functions are called without proper env vars, they will return clear error messages instead of using insecure defaults.

## Files Modified

- `netlify/functions/auth.js` - Added env var validation
- `netlify/functions/pannes.js` - Added env var validation
- `netlify/functions/users.js` - Added env var validation
- `README.md` - Removed credentials, updated image
- `.env.local.example` - Replaced with placeholders
- All documentation files - Scrubbed credentials

## What to Do Next

1. ✅ Set environment variables in Netlify
2. ✅ Trigger a new deployment
3. ✅ Verify build succeeds
4. ✅ Test the application

## Important Notes

- **Never commit** `.env` or `.env.local` files
- **Always use** environment variables for secrets
- **Generate unique** JWT secrets for each environment
- **Rotate credentials** if they were exposed

---

**Status**: ✅ All credentials removed from repository  
**Action Required**: Set environment variables in Netlify  
**Last Updated**: May 6, 2026
