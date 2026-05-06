<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BioMed Connect - Panne Management System

A React + MongoDB application for tracking and managing biomedical equipment failures with AI-powered diagnostics.

[View in AI Studio](https://ai.studio/apps/5b8e9fc2-4c8d-41a3-b205-4bc4212f376b)

## Getting Started

You'll need Node.js v18 or newer installed.

Clone the repo and install dependencies:
```bash
npm install
```

Copy the example env file and add your API keys:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:
- Your Gemini API key
- MongoDB connection string (default provided)
- JWT secret for authentication

Start the dev server:
```bash
npm run dev
```

That's it. The app should be running at `http://localhost:3000`

## Deploying to Netlify

We're using Netlify for hosting. Check out [DEPLOYMENT.md](DEPLOYMENT.md) for the full walkthrough.

Quick version:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set GEMINI_API_KEY "your-api-key"
netlify env:set MONGODB_URI "your-mongodb-connection-string"
netlify env:set JWT_SECRET "your-secure-jwt-secret"
netlify deploy --prod
```

Or use the deployment script:
```bash
./deploy.sh
```

## What's Inside

```
src/
├── components/     # UI components (auth, dashboard, panne forms)
├── services/       # MongoDB and Gemini API integration
└── lib/           # MongoDB config, authentication utilities
```

Key config files:
- `netlify.toml` - Deployment config
- `vite.config.ts` - Build configuration
- `.env.local.example` - Environment variables template

## Environment Variables

You need these environment variables:

```env
# Gemini API key from Google AI Studio
GEMINI_API_KEY=your_gemini_key_here

# MongoDB connection string (default provided)
MONGODB_URI=mongodb+srv://VentureLens:4X32tXo3LeytErBx@cluster0.fvcvl.mongodb.net/venturelens?retryWrites=true&w=majority&appName=Cluster0

# JWT secret for authentication (generate a secure random string)
JWT_SECRET=your-secure-jwt-secret-change-in-production
```

## Database

This app uses **MongoDB** instead of Firebase:
- User authentication with bcrypt password hashing
- JWT token-based sessions
- Collections: `users`, `pannes`
- Connection string is configured in environment variables

## Features

- 🔐 User authentication (email/password)
- 📊 Dashboard with equipment status
- 🔧 Panne (failure) reporting and tracking
- 🤖 AI-powered diagnostics with Gemini
- 👥 Role-based access (Admin, Technician, Nurse, Service)
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **AI**: Google Gemini API
- **Build**: Vite
- **Deployment**: Netlify
