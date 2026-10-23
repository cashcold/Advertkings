import mongoose from 'mongoose';

// Fail fast on queries when disconnected; do not hang or buffer commands
mongoose.set('bufferCommands', false);

let isConnected = false;
let connectionAttempted = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (!connectionAttempted) {
      console.log('ℹ️ MONGODB_URI not configured — running in high-fidelity in-memory fallback store');
      connectionAttempted = true;
    }
    return false;
  }

  // If already attempted and failed, do not block subsequent requests with timeout loops
  if (connectionAttempted && !isConnected) {
    return false;
  }

  try {
    connectionAttempted = true;
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = db.connection.readyState === 1;
    console.log('✅ MongoDB connected successfully to database:', db.connection.name || 'Adkings');
    return isConnected;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, running in fallback memory mode:', error);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
