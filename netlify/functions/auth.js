const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://VentureLens:4X32tXo3LeytErBx@cluster0.fvcvl.mongodb.net/venturelens?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DB_NAME = 'venturelens';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { action, email, password, name, role, service } = JSON.parse(event.body);
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    if (action === 'register') {
      // Check if user exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'User already exists' }),
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = {
        email,
        password: hashedPassword,
        name,
        role: role || 'nurse',
        service: service || '',
        createdAt: new Date().toISOString(),
      };

      const result = await usersCollection.insertOne(newUser);
      const uid = result.insertedId.toString();

      // Generate token
      const token = jwt.sign({ uid, email, name }, JWT_SECRET, { expiresIn: '7d' });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ uid, token, user: { uid, email, name, role: newUser.role } }),
      };
    }

    if (action === 'login') {
      // Find user
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid email or password' }),
        };
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid email or password' }),
        };
      }

      const uid = user._id.toString();
      const token = jwt.sign({ uid, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

      const { password: _, ...userWithoutPassword } = user;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          uid, 
          token, 
          user: { 
            ...userWithoutPassword, 
            uid,
            _id: undefined 
          } 
        }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action' }),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
