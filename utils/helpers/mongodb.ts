// Essentials
import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI!);
    if (connection.readyState === 1) return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};