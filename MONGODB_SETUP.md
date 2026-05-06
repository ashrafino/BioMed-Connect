# MongoDB Setup Guide

This application uses MongoDB as its database instead of Firebase.

## Current Configuration

The app is pre-configured with a MongoDB Atlas connection string:

```
mongodb+srv://VentureLens:4X32tXo3LeytErBx@cluster0.fvcvl.mongodb.net/venturelens?retryWrites=true&w=majority&appName=Cluster0
```

**Database Name**: `venturelens`

## Collections

The application automatically creates and manages these collections:

### 1. `users`
Stores user account information:
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (bcrypt hashed),
  name: String,
  role: String, // 'admin', 'technician', 'nurse', 'service'
  service: String, // Optional department/service
  createdAt: String (ISO date)
}
```

### 2. `pannes`
Stores equipment failure reports:
```javascript
{
  _id: ObjectId,
  equipmentId: String,
  equipmentName: String,
  service: String,
  description: String,
  urgencyLevel: String, // 'Faible', 'Moyenne', 'Elevé'
  status: String, // 'En cours', 'Résolue', 'Critique'
  priorityScore: Number,
  priorityLevel: String,
  reportedBy: String, // User ID
  reportedByName: String,
  technicianId: String, // Optional
  technicianName: String, // Optional
  createdAt: String (ISO date),
  updatedAt: String (ISO date),
  resolvedAt: String, // Optional
  aiSuggestions: Array, // Optional
  priorityDetails: Object // Optional
}
```

## Authentication

The app uses **JWT (JSON Web Tokens)** for authentication:

1. **Registration**: User creates account with email/password
   - Password is hashed using bcrypt (10 salt rounds)
   - User document is created in MongoDB
   - JWT token is generated and returned

2. **Login**: User authenticates with email/password
   - Password is verified against bcrypt hash
   - JWT token is generated with 7-day expiration
   - Token is stored in localStorage

3. **Session Management**: 
   - Token is included in requests (if needed for API calls)
   - Token is verified on app load
   - User is automatically logged out if token expires

## Security Features

- ✅ Passwords are hashed with bcrypt (never stored in plain text)
- ✅ JWT tokens expire after 7 days
- ✅ Tokens are stored in localStorage (client-side)
- ✅ MongoDB connection uses SSL/TLS encryption
- ✅ Connection string can be overridden via environment variable

## Environment Variables

```env
# MongoDB connection string (optional - default provided)
MONGODB_URI=mongodb+srv://VentureLens:4X32tXo3LeytErBx@cluster0.fvcvl.mongodb.net/venturelens?retryWrites=true&w=majority&appName=Cluster0

# JWT secret for token signing (required for production)
JWT_SECRET=your-secure-random-string-here
```

## Using Your Own MongoDB Database

If you want to use your own MongoDB database:

1. **Create a MongoDB Atlas Account** (free tier available)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)

2. **Get Your Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. **Update Environment Variables**
   - Set `MONGODB_URI` in your `.env.local` file
   - Set `MONGODB_URI` in Netlify environment variables

4. **Update the Code** (optional)
   - Edit `src/lib/mongodb.ts`
   - Change the `DB_NAME` constant if needed

## Real-Time Updates

Unlike Firebase's real-time listeners, MongoDB requires polling for updates:

- The app polls for new pannes every 5 seconds
- This is handled automatically in `dataService.listenToPannes()`
- For true real-time updates, consider:
  - MongoDB Change Streams (requires replica set)
  - WebSocket implementation
  - Server-Sent Events (SSE)

## Performance Optimization

For production, consider adding indexes:

```javascript
// In MongoDB Atlas or via MongoDB Shell
db.users.createIndex({ email: 1 }, { unique: true });
db.pannes.createIndex({ createdAt: -1 });
db.pannes.createIndex({ status: 1 });
db.pannes.createIndex({ reportedBy: 1 });
```

## Backup and Monitoring

MongoDB Atlas provides:
- Automatic backups (on paid tiers)
- Performance monitoring
- Real-time alerts
- Database metrics

Access these features in your MongoDB Atlas dashboard.

## Troubleshooting

### Connection Issues

If you see "MongoDB connection error":
1. Check your connection string is correct
2. Verify network access (IP whitelist) in MongoDB Atlas
3. Ensure database user has correct permissions
4. Check if MongoDB Atlas cluster is running

### Authentication Issues

If login/register fails:
1. Check browser console for errors
2. Verify JWT_SECRET is set
3. Check MongoDB connection is working
4. Verify user collection exists

### Data Not Appearing

If data doesn't show up:
1. Check MongoDB Atlas Data Explorer
2. Verify collection names match code
3. Check for JavaScript errors in console
4. Verify user is authenticated

## Migration from Firebase

This app has been migrated from Firebase to MongoDB:

**What Changed:**
- ❌ Firebase Authentication → ✅ JWT + bcrypt
- ❌ Firestore → ✅ MongoDB
- ❌ Real-time listeners → ✅ Polling (5s interval)
- ❌ Google Sign-In → ✅ Email/Password only

**What Stayed the Same:**
- UI/UX remains identical
- All features work the same
- Gemini AI integration unchanged
- Role-based access control preserved

## Support

For MongoDB-specific issues:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Support](https://www.mongodb.com/cloud/atlas/support)
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
