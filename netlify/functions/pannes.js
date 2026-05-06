const { MongoClient, ObjectId } = require('mongodb');
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

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Verify authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid token' }),
      };
    }

    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const pannesCollection = db.collection('pannes');

    // GET - List all pannes
    if (event.httpMethod === 'GET') {
      const pannes = await pannesCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(pannes.map(p => ({ ...p, id: p._id.toString(), _id: undefined }))),
      };
    }

    // POST - Create new panne
    if (event.httpMethod === 'POST') {
      const panneData = JSON.parse(event.body);
      const result = await pannesCollection.insertOne({
        ...panneData,
        createdAt: new Date().toISOString(),
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ id: result.insertedId.toString() }),
      };
    }

    // PUT - Update panne
    if (event.httpMethod === 'PUT') {
      const { id, ...updates } = JSON.parse(event.body);
      await pannesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date().toISOString() } }
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    // DELETE - Delete panne
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body);
      await pannesCollection.deleteOne({ _id: new ObjectId(id) });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Pannes error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
